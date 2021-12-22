// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract TasksContract { 
    
    uint public taskCounter = 0;

    constructor (){
        createTask('Primer Tarea', 'Tarea de ejemplo');
    }

    event taskCreated (
        uint id,
        string title,
        string description,
        bool done,
        uint createdAt
    );
    event taskToogleDone(
        uint id,
        bool done
    );

    struct Task {
        uint id;
        string title;
        string description;
        bool done;
        uint createdAt;
    }

    mapping ( uint  => Task ) public tasks;
    
    function createTask (string memory _title, string memory _description) public{
        taskCounter++;
        tasks[taskCounter] =  Task(taskCounter, _title, _description, false, block.timestamp);
         emit  taskCreated(taskCounter, _title, _description, false, block.timestamp);

    }   
   
    function toogleDone (uint  _id) public {
        Task  memory  _task = tasks[_id];
        _task.done = !_task.done;
        tasks[_id] = _task;
        emit taskToogleDone(_id, _task.done);
    }




}