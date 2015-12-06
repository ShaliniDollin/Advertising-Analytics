
#Attributes file to control the build process of cassandra.
#Please review the changes thourougly before you SAVE/COMMIT the cookbook,
#Any incorrect updates will cause deployment failure or wrongly setup of cassandra cluster

default[:cassandra_dse_build_cookbook] = {
  :templates_cookbook => "cassandra_dse_build_cookbook",

###Cassandra Build Version and Binary Section
  #Find the software availability in the below SAT Servers
  #SDC : http://sdc-satproxy.walmart.com/database/ 
  #DFW : http://dfw-satproxy.prod.walmart.com/database/
  #DAL : http://dal-satproxy.prod.walmart.com/database/
  
  :dse_version  => "4.6.0",          
  :jdk_binary   => "jdk-8u40-linux-x64.tar.gz",
  :jdk_version  => "1.8.0_40",
  :opscenter_version => "5.0.2",
  

##cassandra-topology.properties parameter file Section 
##Update this section how to reflect in your "cassandra-topology.properties" file.

  :topology_properties  => "# Cassandra Node IP=Data Center:Rack
  
# Servers start
#DFW
10.65.41.10=DFW:RAC0
10.65.41.11=DFW:RAC0
10.65.41.12=DFW:RAC0
10.65.41.13=DFW:RAC0
10.65.41.14=DFW:RAC0
10.65.41.15=DFW:RAC0
10.65.41.16=DFW:RAC0
#DAL
10.65.169.10=DAL:RAC0
10.65.169.11=DAL:RAC0
10.65.169.12=DAL:RAC0
10.65.169.13=DAL:RAC0
10.65.169.14=DAL:RAC0
10.65.169.15=DAL:RAC0
10.65.169.16=DAL:RAC0
# Servers end
# default for unknown nodes
default=DFW:RAC0",

##Cassandra Build Requirements Section

  :user => "cassandra",
  :group => "app",
  :jvm_dir          => "/app/cassandra/datastax/jvm",
  :conf_dir         => "/app/cassandra/datastax/dse-node[:dse_version]/resources/cassandra/conf",
  :dse_path_dir     => "/resources/cassandra/conf", 
  :software_dir     => "/app/cassandra/software",
  :admin_dir        => "/app/cassandra/dba",
  :saved_cache_dir  => "/app/cassandra/datastax/commitlog/saved_caches",
  :data_root_dir    => "/app/cassandra/datastax",
  :commitlog_dir    => "/app/cassandra/datastax/commitlog",
  :system_log_dir   => "/app/cassandra/datastax/dse-data00/log",

##Cassandra.yaml file parameter values Section
  :cluster_name => "SEARCHER_PROD",
  :initial_token => "",
  :listen_address   => node[:ipaddress],
  :authenticaton    => "org.apache.cassandra.auth.PasswordAuthenticator",
  :authorizer       => "org.apache.cassandra.auth.CassandraAuthorizer",
  :partitioner      => "org.apache.cassandra.dht.Murmur3Partitioner",
  :rpc_address      => node[:ipaddress],
  :max_heap_size    => "20G",
  :heap_new_size    => "10G",
  :num_tokens       => 64,
  :data_file_directories => "[/app/cassandra/datastax/dse-data00,/app/cassandra/datastax/dse-data01,/app/cassandra/datastax/dse-data02]",
  :seeds            => "10.65.41.10,10.65.41.11,10.65.169.10,10.65.169.11",    #example=> "DC1-node1-IP,DC1-node2-IP,DC2-node1-IP,DC2-node2-IP"
  :concurrent_reads => 256,
  :concurrent_writes => 128,
  :concurrent_compactors => 16,
##  :memtable_flush_queue_size => 6,
  :trickle_fsync => true,
  :compaction_throughput_mb_per_sec => 180,
  :hinted_handoff_throttle_in_kb => 8192,
  :max_hints_delivery_threads => 8,
  :memtable_flush_writers => 16,
  :key_cache_size_in_mb => 512,
  :row_cache_size_in_mb => 0,
  :row_cache_save_period => 0,
  :stream_throughput_outbound_megabits_per_sec => 4000,
  :streaming_socket_timeout_in_ms => 0,
  :snitch           => 'org.apache.cassandra.locator.PropertyFileSnitch',
  :service_name => "cassandra",
  :service_action => [:enable, :start],
  #:max_hint_window_in_ms=> 10800000, # 3 hours
  #:key_cache_size_in_mb => "",
  #:broadcast_address => node[:ipaddress],
  #:start_rpc        => "true",
  #:rpc_port         => "9160",
  #:range_request_timeout_in_ms => 10000,
  #:streaming_socket_timeout_in_ms => 0, #never timeout streams
  #:start_native_transport  => "true",
  #:native_transport_port   => "9042",
  #:xss              => "256k",
  #:vnodes           => false,
  #:index_interval   => 128,
  #:snitch_conf      => false,
  #:enable_assertions => true,
  #:jmx_server_hostname => false,
  #:auto_bootstrap => true,
  
}
