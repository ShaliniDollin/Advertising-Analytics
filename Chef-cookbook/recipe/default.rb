yum_package 'expect' do
  action :install
end

#Conditional check, if dse intended version folder already exists this will skip the rest of deployment process.
if (::File.exists?("/app/cassandra/datastax/dse-#{node[:cassandra_dse_build_cookbook][:dse_version]}"))
puts("chef-client Finished : DSE-#{node[:cassandra_dse_build_cookbook][:dse_version]} binary is already present. Please check the version you want to deploy.")
else

# Resource to create the required directories

[node.cassandra_dse_build_cookbook.software_dir, node.cassandra_dse_build_cookbook.commitlog_dir, node.cassandra_dse_build_cookbook.admin_dir, node.cassandra_dse_build_cookbook.saved_cache_dir, node.cassandra_dse_build_cookbook.system_log_dir, node.cassandra_dse_build_cookbook.jvm_dir].each do |dir|
  directory dir do
    owner     node.cassandra_dse_build_cookbook.user
    group     node.cassandra_dse_build_cookbook.group
  end
end

#Remote Copy of Binaries from SAT Server

remote_file "/app/cassandra/software/dse-#{node[:cassandra_dse_build_cookbook][:dse_version]}-bin.tar.gz" do
  source "http://dfw-satproxy.prod.walmart.com/database/dse-#{node[:cassandra_dse_build_cookbook][:dse_version]}-bin.tar.gz"
  owner     node.cassandra_dse_build_cookbook.user
  group     node.cassandra_dse_build_cookbook.group
  #checksum "3a7dac00b1" # A SHA256 (or portion thereof) of the file.
  #checksum "00c52be72ebd2260469116e020c0145b8603e49f93f8bb102adcc52591c77287"
end

remote_file "/app/cassandra/software/#{node[:cassandra_dse_build_cookbook][:jdk_binary]}" do
  source "http://dfw-satproxy.prod.walmart.com/database/#{node[:cassandra_dse_build_cookbook][:jdk_binary]}"
  owner     node.cassandra_dse_build_cookbook.user
  group     node.cassandra_dse_build_cookbook.group
  #checksum "3a7dac00b1" # A SHA256 (or portion thereof) of the file.
  #checksum "da1ad819ce7b7ec528264f831d88afaa5db34b7955e45422a7e380b1ead6b04d"
end

remote_file "/app/cassandra/software/cassandra_build_scripts.tar.gz" do
  source "http://dfw-satproxy.prod.walmart.com/database/cassandra_build_scripts.tar.gz"
  owner     node.cassandra_dse_build_cookbook.user
  group     node.cassandra_dse_build_cookbook.group
  #checksum "3a7dac00b1" # A SHA256 (or portion thereof) of the file.
  checksum "f5c605c69879ed14750e16a53190b6ae4d6aa19411831f12066d0e160dbef389"
end

remote_file "/app/cassandra/software/opscenter-#{node[:cassandra_dse_build_cookbook][:opscenter_version]}.tar.gz" do
  source "http://dfw-satproxy.prod.walmart.com/database/opscenter-#{node[:cassandra_dse_build_cookbook][:opscenter_version]}.tar.gz"
  owner     node.cassandra_dse_build_cookbook.user
  group     node.cassandra_dse_build_cookbook.group
  #checksum "3a7dac00b1" # A SHA256 (or portion thereof) of the file.
  checksum "f00ef8d702a6199b01ef587bf88536290de2f79ab1fc7048897c12ab154fbc39"
end

#Untar the downloaded Binaries from SAT Server

execute "untaring_DSE_Binaries" do
command "tar -zxvf /app/cassandra/software/dse-#{node[:cassandra_dse_build_cookbook][:dse_version]}-bin.tar.gz -C /app/cassandra/datastax"    
#not_if { ::File.exists?("/app/cassandra/datastax/dse-#{node[:cassandra_dse_build_cookbook][:dse_version]}")}
end

execute "untaring_JDK_Binaries" do
 command "tar -zxvf /app/cassandra/software/#{node[:cassandra_dse_build_cookbook][:jdk_binary]}  -C /app/cassandra/datastax/jvm"
end

execute "untaring_Build_Binaries" do
  command "tar -xvzf /app/cassandra/software/cassandra_build_scripts.tar.gz -C /app/cassandra/software"
end

execute "Setting_up_profiles" do
  command "cp -r /app/cassandra/software/cassandra_build_scripts/profiles/./  /app/cassandra/"
end

execute "Setting_up_Admin_Scripts" do
  command "tar -xvf /app/cassandra/software/cassandra_build_scripts/dba.tar  -C /app/cassandra"
end

execute "Ownership_Changes_software" do
 command "chown -R cassandra:app /app/cassandra/software"
end

execute "Ownership_Changes_profiles" do
 command "chown cassandra:app /app/cassandra/.*"
end

execute "Remove old symbolic link to jdk binary" do
  command "rm -rf /app/cassandra/datastax/jvm/jdk_latest"
end

execute "Create Symbloic link to point to latest jvm version" do
  command "ln -s /app/cassandra/datastax/jvm/jdk#{node[:cassandra_dse_build_cookbook][:jdk_version]}  /app/cassandra/datastax/jvm/jdk_latest"
end

execute "Modify the DSE_HOME to new version" do
  command "sed -i 's/4.6.0/#{node[:cassandra_dse_build_cookbook][:dse_version]}/g' /app/cassandra/.bash_profile"
end

execute "Ownership_Changes_datastax" do
 command "chown -R cassandra:app /app/cassandra/datastax"
end

execute "Ownership_Changes_dba" do
 command "chown -R cassandra:app /app/cassandra/dba"
end

execute "Permission_Changes_datastax_DSE_folder" do
 command "chmod -R 755 /app/cassandra/datastax/dse-#{node[:cassandra_dse_build_cookbook][:dse_version]}"
end


#Deploying Cassandra Templates
dse_vers=node[:cassandra_dse_build_cookbook][:dse_version]
if dse_vers == "4.6.0" || dse_vers == "4.6.5" 
  %w(cassandra.yaml cassandra-env.sh log4j-server.properties cassandra-topology.properties).each do |f|
    dse_dir=node[:cassandra_dse_build_cookbook][:data_root_dir]
    dse_ver="dse-#{node[:cassandra_dse_build_cookbook][:dse_version]}"
    dse_path=node[:cassandra_dse_build_cookbook][:dse_path_dir]
    template File.join(dse_dir,dse_ver,dse_path, f) do   
    cookbook node["cassandra_dse_build_cookbook"]["templates_cookbook"]
    source "#{f}.#{node[:cassandra_dse_build_cookbook][:dse_version]}.erb"
    owner     node.cassandra_dse_build_cookbook.user
    group     node.cassandra_dse_build_cookbook.group    
    mode  0644
  end
end
else
  %w(cassandra.yaml cassandra-env.sh logback.xml cassandra-topology.properties).each do |f|
    dse_dir=node[:cassandra_dse_build_cookbook][:data_root_dir]
    dse_ver="dse-#{node[:cassandra_dse_build_cookbook][:dse_version]}"
    dse_path=node[:cassandra_dse_build_cookbook][:dse_path_dir]
    template File.join(dse_dir,dse_ver,dse_path, f) do   
    cookbook node["cassandra_dse_build_cookbook"]["templates_cookbook"]
    source "#{f}.#{node[:cassandra_dse_build_cookbook][:dse_version]}.erb"
    owner     node.cassandra_dse_build_cookbook.user
    group     node.cassandra_dse_build_cookbook.group    
    mode  0644
  end
end
end


#execute "Starting_Cassandra" do
# command "/app/cassandra/datastax/dse-#{node[:cassandra_dse_build_cookbook][:dse_version]}/bin/dse cassandra"
#end


#Consolidated SSL Opscenter agent Installation

execute "Opscenter_Installation" do
 command "tar -zxvf /app/cassandra/software/opscenter-#{node[:cassandra_dse_build_cookbook][:opscenter_version]}.tar.gz -C /app/cassandra/datastax"
not_if { ::File.exists?("/app/cassandra/datastax/opscenter-#{node[:cassandra_dse_build_cookbook][:opscenter_version]}")}
end

execute "Ownership_Changes_Opscenter" do
 command "chown -R cassandra:app /app/cassandra/datastax/opsc*"
end

execute "Remove script tar file" do
  command "rm -rf /app/cassandra/software/cassandra_build_scripts.tar"
end

puts("chef-client Finished : DSE-#{node[:cassandra_dse_build_cookbook][:dse_version]}. Deployment completed successfully.")

end
