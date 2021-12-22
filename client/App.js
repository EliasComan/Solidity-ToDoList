
App = {
   contracts:{},
    init: async () => {
        await   App.LoadEthereum();
        await App.LoadContracts();
        await App.loadAcounts();
        await App.render();
        await App.renderTask();

    },

    LoadEthereum : async ()  => {
        if(window.ethereum){
           App.web3Provider=window.ethereum;
             await window.ethereum.request({ method: 'eth_requestAccounts' });
             
           
        }else if (window.web3){
              App.web3  =   new web3(window.web3.currentProvider)
              
          }
        else{
            console.log('No ethereum in the browser');
        }
    },
    
    LoadContracts : async () => {
       const res = await  fetch("TasksContract.json");
       const contractJson =  await res.json();
        App.contracts.TasksContract = await TruffleContract(contractJson)
        App.contracts.TasksContract.setProvider(App.web3Provider)
        App.TasksContract = await App.contracts.TasksContract.deployed();
    },

    loadAcounts: async () => {
       const account =  await window.ethereum.request({ method: 'eth_requestAccounts' });
       App.acount = account[0]
    },
    render: async () => {
        document.getElementById('account').innerHTML =  await App.acount
        
    },
    renderTask : async () => {
        const taskCounter = await App.TasksContract.taskCounter();
        const taskCounterNumber = await taskCounter.toNumber();
        let html = ''

        for (let i = 1; i <= taskCounterNumber; i++) {
            const task = await App.TasksContract.tasks(i)
            const taskId = task[0];
            const taskTitle = task[1];
            const taskDescription = task[2];
            const taskDone = task[3];
            const taskTime = task[4];

            let taskElement = ` 
                <div class='card bg-secondary rounder-0 mb-2 align-items'>
                 <div class = 'card-header d-flex justify-content-between align-items-center'>
                    <span> ${taskTitle}</span>
                    <div class='form-check form-switch'>
                    <input class='form-check-input 
                    form-switch'
                    onchange="App.toggleDone(this)" 
                    data-id="${taskId}"
                    ${taskDone && 'checked'} type='checkbox'>
                    </div>
                    </input>
                 </div>
                  <div class= 'card-body'>
                   <span> ${taskDescription}</span>
                   <p>Task was created : ${new Date(taskTime * 1000).toLocaleString()}</p>
                  </div>
                </div>` 

            html += taskElement;
        }

        document.querySelector('#taskList').innerHTML = html
    },

    createTask : async (title, description) => {
        await App.TasksContract.createTask(title,description, {
            from: await App.acount
        })
        App.renderTask();
    },
    toggleDone : async (element) => {
     const taskId = await element.dataset.id

     await App.TasksContract.toogleDone(taskId, 
            {from: await App.acount})
        window.location.reload
    },

}


App.init();