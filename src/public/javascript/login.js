// declare all funcs in an annomous function to avoid global scope

(function() {
    var getScriptURL = (function() {
      var scripts = document.getElementsByTagName("script");
      var index = scripts.length - 1;
      var myScript = scripts[index];
      return function() {
        return myScript.src;
      };
    })();
    const fileName = getScriptURL().split("/").find(e => e.endsWith(".js"));
    console.log("[DEBUG] loading instance for " + fileName);
    // start code after loaded
    window.addEventListener("load", () => {
      console.debug("[DEBUG] starting instance for " + fileName);
      try {
        let proc = main();
        if (proc instanceof Promise) {
          proc.catch(e => console.error(e.message));
        }
      } catch (e) {
        console.error(e.message);
      }
    });
   async function main() {
      // ...
      // ...
      // ..
      // code
document.querySelector("#btn").onclick = () => {
    my_modal_2.showModal();
}

//  check if the queries include error 
//  if so, show the error
const queries = new URLSearchParams(location.search);
if (queries.has("error")) {
document.querySelector("#error").classList.remove("hidden")
}
// //  fetch and if logged in redirect to dash
// const response = await fetch("/api/isloggedin")
// response.status === 200 && location.replace("/dash")

}
  })();
  console.debug("[DEBUG] LOADING FILE");
  