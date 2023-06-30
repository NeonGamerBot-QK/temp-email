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
      let email = ""
      let selected_email = null
      let emails = []
      fetch('/get_email').then(r => {
        if(r.status === 400) {
            fetch('/get_email', { method: 'POST'}).then(j => j.json()).then(res => {
                email = res.email
                document.querySelector("#email").innerHTML = email
                document.querySelector("#email").value = email
      runFetch()

            })
        } else {
            r.json().then(res => {
                email = res.email
                document.querySelector("#email").innerHTML = email
                document.querySelector("#email").value = email
      runFetch()

            })
        }

      })

      setInterval(() => {   
if(selected_email !== null) return;
        runFetch(true)
      }, 5_000)
      async function runFetch(interval = false) {
      if(selected_email !== null) return;

      if(!interval)  document.querySelector("#emails").innerHTML = `<span class="loading loading-spinner loading-lg"></span>`
        fetch('/email').then(r => r.json()).then(res => {
      if(selected_email !== null) return;
      
          if(res.data && res.data.length > 0) {
            document.querySelector("#emails").innerHTML = `<div class="overflow-x-auto">
            <table class="table pb-5">
              <!-- head -->
              <thead>
                <tr>
                  <th>#</th>
                  <th>Subject</th>
                  <th>FROM</th>
                </tr>
              </thead>
              <tbody id='inner_emails'>
              
              </tbody>
              </table>
            </div>`
            emails = res.data
              res.data.forEach((e, index) => 
              {
                  const div = document.getElementById(index) || document.createElement("tr")
                  const id = document.createElement("td")
                  const subject = document.createElement("td")
                  const from = document.createElement("td")
                  div.onclick = () => {
                    console.log("#click " + index)
                    selected_email = index;
                    insertSelectedEmail()
                  }
                  div.id = index
                  div.className = 'hover cursor-pointer'
      id.innerHTML = index
      subject.innerHTML = e.subject
      from.innerHTML = e.from.text
      div.appendChild(id)
      div.appendChild(subject)
      div.appendChild(from)
                  document.querySelector("#inner_emails").appendChild(div)
              })
          } else {
              document.querySelector("#emails").innerHTML = "No emails"
          }
      })
      function insertSelectedEmail() {
        if(selected_email == null) return;
        console.log("inserting " + selected_email)
       const res = { data: emails[selected_email] }
      
          document.querySelector('#emails').innerHTML = `<div class="w-full bg-base-200 shadow-xl m-5 min-w-screen">
          <div class="card-body">
          <button class="btn btn-primary" onclick="window.clearSelectedEmail()">Back</button>
            <h2 class="card-title bg-base-300 p-2 rounded-lg">${res.data.subject}</h2>
            <p class='text-left p-2 bg-base-300 rounded-lg'>${res.data.from.text}</p>
          </div>
          <div class='text-justify border p-2 m-5' >
           ${res.data.html ? res.data.html : ` <p class="m-5">${res.data.text}</p>`}
          </div>
        </div>`
      
      }
     
    window.clearSelectedEmail = () => {
      selected_email = null;
      document.querySelector("#emails").innerHTML = `<span class="loading loading-spinner loading-lg"></span>`

    }  
    }
    const editor = await   ClassicEditor
    .create( document.querySelector( '#editor' ) )

    const form = document.querySelector("#sendemail");
    console.log("form bef", form)
    form.addEventListener("submit", (e) => {
        e.preventDefault();
      
        console.log("#form")
         
        const data = Object.fromEntries(new FormData(form));
        const html = editor.getData()
        data.body = html
        data.to = data.email
    console.log(data)
        fetch("/sendemail", {
            method: "POST",
            body: JSON.stringify(data),
            //  headers
            headers: {
                "Content-Type": "application/json",
            }
  
        }).then(r => r.json()).then((data) => {
        //  ...
if(data.status === 201) {
  alert("Email sent successfully")
}
      })
})  
}

  })();
  console.debug("[DEBUG] LOADING FILE");
  