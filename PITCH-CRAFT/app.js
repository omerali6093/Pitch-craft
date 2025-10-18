const SUPABASE_URL = "https://eemagvauvidoqtzupiiz.supabase.co";
const  SUPABASE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVlbWFndmF1dmlkb3F0enVwaWl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3ODc2ODIsImV4cCI6MjA3NjM2MzY4Mn0.AMl3hItaUXl6nsecv3r8mljrlt79Bf-RU0aNAxW5XCI";


const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_API_KEY);

console.log(supabase);


const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const signupBtn = document.getElementById("signup");
const loginBtn = document.getElementById("login");
const formContainer = document.getElementById("form-container")
const mainContainer = document.getElementById("main-content")
const launching = document.getElementById("launching")
const startupSection = document.getElementById("startup-section")

signupBtn.addEventListener("click", async ()=> {
   const {data , error} = await supabase.auth.signUp(
    {
        email: emailInput.value,
        password: passwordInput.value
    }
   )

   if(error) {
    alert(error.message)
    console.log(error);
   }

   alert("Successfully logged in please check your email")
   console.log(data)
    
});


loginBtn.addEventListener("click", async () => {
    const {data, error} = await supabase.auth.signInWithPassword({
        email: emailInput.value,
        password: passwordInput.value
    })

    if(error) {
        alert(error.message)
        console.log(error);    
        return;    
    }

    if(data) {
        formContainer.classList.add("hidden")
        mainContainer.classList.remove("hidden")
        alert("Successfully logged in")
        console.log(data);
        
    }

})

launching.addEventListener("click", async() =>{
   formContainer.classList.add("hidden")
   mainContainer.classList.add("hidden")
   launching.classList.remove("hidden")
})


