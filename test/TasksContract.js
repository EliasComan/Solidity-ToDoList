const TasksContraks = artifacts.require('TasksContract');

contract('TasksContraks',() => {
    before(async ()  => {
        this.tasksContract = await TasksContraks.deployed();

    })
    it('Migrate deployed succesfully', async () => {
       const address =  this.tasksContract.address
       assert.notEqual(address, null) 
    })

    it('Get tasks List', async () => {
        const taskCounter = await  this.tasksContract.taskCounter();
        const task =  await this.tasksContract.tasks(taskCounter);

        assert.equal(task.id.toNumber(), taskCounter )
    })

    it('Task Created Succesfully' , async () => { 
        const createTask = await this.tasksContract.createTask('Tarea 2', 'Segunda tarea');
        const taskEvent = await createTask.logs[0].args;
        
        assert.equal(taskEvent.id.toNumber(), 2);

    })
    it('Task toogle done', async () => {
        const result = await this.tasksContract.toogleDone(1);
        const taskEvent = await result.logs[0].args;
        const task = await this.tasksContract.tasks(1);

        assert.equal(task.done, true );
        assert.equal(taskEvent.done, true);
        assert.equal(task.id, 1)

    })
 })