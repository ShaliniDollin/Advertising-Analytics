var Script = function () {

    $.validator.addMethod("password_not_same", function(value, element) {
        console.log($('#password1').val());
        console.log($('#confirm_password').val());
         return str($('#password').val()) === str($('#confirm_password').val()) ;
      }, "Please enter the same password as above.");
        // validate the comment form when it is submitted
    $("#login_form").validate({
            rules: {
                password: {
                    required: true,
                    minlength: 5
                },
                email: {
                    required: true,
                    email: true
                }
            },
            messages: {

                password: {
                    required: "Please provide a password.",
                    minlength: "Your password must be at least 5 characters long."
                },

                email: "Please enter a valid email address.",

            }
        });
        // validate signup form on keyup and submit
        $("#register_form").validate({

            rules: {
                fname: {
                    required: true,
                    minlength: 3
                },
                lname: {
                    required: true,
                    minlength: 2
                },
                address: {
                    required: true,
                    minlength: 5
                },
                password1: {
                    required: true,
                    minlength: 5
                },
                confirm_password: {
                    required: true,
                    minlength: 5,
                    password_not_same: true
                },
                email: {
                    required: true,
                    email: true
                }
            },
            messages: {
                fname: {
                    required: "Please enter a First Name.",
                    minlength: "Your First Name must consist of at least 3 characters long."
                },
                lname: {
                    required: "Please enter a Last Name.",
                    minlength: "Your Last Name must consist of at least 2 characters long."
                },
                address: {
                    required: "Please enter a Organization Name.",
                    minlength: "Your Organization must consist of at least 5 characters long."
                },
                password1: {
                    required: "Please provide a password.",
                    minlength: "Your password must be at least 5 characters long."
                },
                confirm_password: {
                    required: "Please provide a password.",
                    minlength: "Your password must be at least 5 characters long.",
                },
                email: "Please enter a valid email address.",

            }
        });

        // propose username by combining first- and lastname
        $("#username").focus(function() {
            var firstname = $("#firstname").val();
            var lastname = $("#lastname").val();
            if(firstname && lastname && !this.value) {
                this.value = firstname + "." + lastname;
            }
        });

        //code to hide topic selection, disable for demo
        var newsletter = $("#newsletter");
        // newsletter topics are optional, hide at first
        var inital = newsletter.is(":checked");
        var topics = $("#newsletter_topics")[inital ? "removeClass" : "addClass"]("gray");
        var topicInputs = topics.find("input").attr("disabled", !inital);
        // show when newsletter is checked
        newsletter.click(function() {
            topics[this.checked ? "removeClass" : "addClass"]("gray");
            topicInputs.attr("disabled", !this.checked);
        });

} ();
