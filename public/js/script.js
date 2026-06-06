(
    () =>{
        "user strict";

        // Fetch all the forms we want to apply custom Bootstrap validation style to 
        const forms = document.querySelectorAll(".needs-validation");

        // Loop over them and prevent submission 
        Array.form(forms).forEach((form) => {
            form.addEventListener(
                "submit",
                (event) => {
                    if(!form.checkValidation()){
                        event.preventDefult();
                        event.stopPropagation();
                    }

                    form.classList.add("was-validated")
                },
                false
            );
        });
    }
)();
