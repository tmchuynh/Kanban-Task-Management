
(function () {

    //CALCULATE ORDER
    /**
     * It finds all the `.up` and `.down` links in the page and adds an event listener to each one
     */
    function calcUpDown() {
        var ulPanels = document.querySelectorAll(".section");
        for (var x = 0; x < ulPanels.length; x++) {
            var upLink = ulPanels[x].querySelectorAll(".up");
            /* Removing the event listener from the upLink array and then adding it back. */
            for (var i = 0; i < upLink.length; i++) {
                upLink[i].removeEventListener('click', upListener);
                upLink[i].addEventListener('click', upListener);
            }
            var downLink = ulPanels[x].querySelectorAll(".down");
            for (var i = 0; i < downLink.length; i++) {
                downLink[i].removeEventListener('click', downListener);
                downLink[i].addEventListener('click', downListener);
            }
        }
    }


    //TO DO button
    var toDoButton = elem('addToDo');
    var toDoList = elem('ul-todo');
    toDoButton.addEventListener('click', function () {

        var newList = document.createElement("li");
        /* Creating a new list item and adding the text "New Task" to it. */
        newList.innerHTML = '<span class="txt">New Task</span><span class="idTask"></span><a class="up" href="#"></a><a class="down" href="#"></a><a class="delete" onclick="delTask(event, this.parentNode)" href="#"></a>';

        var lis = document.getElementsByTagName('li');
        var finalID;
        /* Creating a unique ID for each list item. */
        if (lis.length == 0) {
            finalID = '0001';
        } else {
            var ids = [];
            /* Getting the id of each li element and pushing it into an array. */
            for (var i = 0; i < lis.length; i++) {
                console.log(lis[i].getAttribute('id').slice(3));
                ids.push(lis[i].getAttribute('id').slice(3));
            }
            finalID = parseInt(ids.sort().pop());
            finalID++;
            /* Adding a 0 to the front of the ID number until it is 4 digits long. */
            while (finalID.toString().length < 4) {
                finalID = '0' + finalID;
            }
        }

        newList.setAttribute('id', 'li-' + finalID);
        newList.setAttribute('draggable', 'true');
        newList.setAttribute('ondragstart', 'drag(event)');
        newList.setAttribute('ontouchstart', 'drag(event)'); 

        newList.childNodes[1].innerText = finalID;

        toDoList.prepend(newList);
        changeTask();
        calcUpDown();

        /* Selecting the first item in the list and clicking it. */
        var list = elem("ul-todo").firstChild;
        var item = list.children[0];
        item.click();

        countTask();

        saveBoards();

    });

    //OK BUTTON
    var okButton = elem('taskButton');
    /* The below code is adding an event listener to the okButton. When the okButton is clicked, the
    code will get the value of the taskText input and set it as the innerText of the span element. */
    okButton.addEventListener('click', function () {
        var newText = elem('taskText');
        var theTask = elem(globalID).getElementsByTagName('span')[0];
        result = newText.value;
        if (result == '') {
            newText.setAttribute('placeholder', 'write something...')
        } else {
            theTask.innerText = result;
            closeModal();
            saveBoards();
        }
    });

    //CLOSE MODAL
    var closeBox = elem('modalClose');
    closeBox.onclick = closeModal;
    var closeOverlay = elem('modalOverlay');
    closeOverlay.onclick = closeModal;

    //DELETE BUTTON
    var deleteButton = elem('deleteItem');
    deleteButton.addEventListener('click', function () {

        if (elem('totalTask').innerHTML == '0') return;

        /* Checking if the local storage item OptHideConfirm is not null. If it is not null, it will
        remove the local storage items listToDo, listWorking, listUrgent, and listDone. It will then
        set the local storage item listToDo to an empty string. It will then refresh the page. */
        if (localStorage.getItem('OptHideConfirm') !== null) {
            localStorage.removeItem('listToDo');
            localStorage.removeItem('listWorking');
            localStorage.removeItem('listUrgent');
            localStorage.removeItem('listDone');
            localStorage.setItem('listToDo', '');
            location.href = location.href;
        } else {
            elem('confirmTitle').innerHTML = 'ALL TASKS';
            elem('confirmDelete').style.display = 'block';
            elem('confirmBox').style.display = 'block';
            var delConfirm = elem("confirmBtn");
            /* The below code is deleting the local storage and refreshing the page. */
            delConfirm.addEventListener('click', function () {
                localStorage.removeItem('listToDo');
                localStorage.removeItem('listWorking');
                localStorage.removeItem('listUrgent');
                localStorage.removeItem('listDone');
                localStorage.setItem('listToDo', '');
                location.href = location.href;
            });
            /* Creating a variable called canConfirm and assigning it to the element with the id of
            confirmCls. It is then adding an event listener to the canConfirm variable. When the
            event listener is triggered, it will hide the elements with the ids of confirmDelete and
            confirmBox. */
            var canConfirm = elem("confirmCls");
            canConfirm.addEventListener('click', function () {
                elem('confirmDelete').style.display = 'none';
                elem('confirmBox').style.display = 'none';
            });
        }
    });

    //ADD URGENT LIST
    var urgentBoard = elem('addUrgent');
    urgentBoard.addEventListener('click', function () {
        if (elem('ur-gent')) { 

            var urgTskNum = elem('ur-gent').childNodes[1].childNodes.length;
            if (urgTskNum == 0) {
                this.parentNode.classList.remove("active");
                elem('myLists').classList.remove('fourCol');
                elem('ur-gent').remove();
                saveBoards();
            } else {
                /* Checking if the localStorage item OptHideConfirmUrgent is null. If it is null, it
                will display the confirmDelete and confirmUrgent elements. It will also set the
                innerHTML of the numTaskUrg element to the value of the urgTskNum variable. If the
                urgTskNum variable is equal to 1, it will hide the pluralTsk element. If it is not
                equal to 1, it will remove the style attribute from the pluralTsk element. */
                if (localStorage.getItem('OptHideConfirmUrgent') == null) {
                    elem('confirmDelete').style.display = 'block';
                    elem('confirmUrgent').style.display = 'block';
                    elem('numTaskUrg').innerHTML = urgTskNum;
                    if (urgTskNum == 1) elem('pluralTsk').style.display = 'none'; else elem('pluralTsk').removeAttribute('style');

                    /* Removing the urgent board. */
                    var delConfirmUrgent = elem("confirmUrgentBtn");
                    delConfirmUrgent.addEventListener('click', function () {
                        elem('addUrgent').parentNode.classList.remove("active");
                        elem('myLists').classList.remove('fourCol');
                        if (elem('ur-gent')) elem('ur-gent').remove();
                        saveBoards();
                        elem('confirmDelete').style.display = 'none';
                        elem('confirmUrgent').style.display = 'none';
                    });
                    /* Adding an event listener to the element with the id of confirmUrgentCls. */
                    var canConfirmUrgent = elem("confirmUrgentCls");
                    canConfirmUrgent.addEventListener('click', function () {
                        elem('confirmDelete').style.display = 'none';
                        elem('confirmUrgent').style.display = 'none';
                    });
                } else {
                    this.parentNode.classList.remove("active");
                    elem('ur-gent').remove();
                    saveBoards();
                }
            }

        } /* Adding a new board to the list of boards. */
        else { 
            this.parentNode.classList.add("active");
            elem('myLists').classList.add('fourCol');
            var newBoard = document.createElement("div");
            newBoard.innerHTML = '<h3>Urgent <span>0</span></h3><ul id="ul-urgent" class="section" ondrop="drop(event, this)" ondragover="allowDrop(event)" ondragenter="dragEnter(event)" ondragleave="dragLeave(event)"></ul>';
            newBoard.setAttribute('id', 'ur-gent');
            elem('myLists').insertBefore(newBoard, elem('do-ne'));
            if (elem('do-ne').className == 'full') elem('ur-gent').className = 'full';
            if (elem('do-ne').getAttribute('style') != null) elem('ur-gent').setAttribute('style', elem('do-ne').getAttribute('style'));
            saveBoards();
        }
    });

    /* Adding an event listener to the checkbox. If the checkbox is checked, it will add the item to
    local storage. If the checkbox is unchecked, it will remove the item from local storage. */
    var checkConfirm = elem("dontShowAgain");
    checkConfirm.addEventListener('change', function () {
        if (this.checked) {
            localStorage.setItem('OptHideConfirm', 'true');
            document.querySelector('.deleteWarnig').classList.remove('showWng');
            elem('textWarning').innerHTML = 'SHOW';
        } else {
            localStorage.removeItem('OptHideConfirm');
            document.querySelector('.deleteWarnig').classList.add('showWng');
            elem('textWarning').innerHTML = 'HIDE';
        }
    });

   /* Checking if the checkbox is checked or not. If it is checked, it will save the value in local
   storage. If it is not checked, it will remove the value from local storage. */
    var checkConfirmUrgent = elem("dontShowAgainUrgent");
    checkConfirmUrgent.addEventListener('change', function () {
        if (this.checked) {
            localStorage.setItem('OptHideConfirmUrgent', 'true');
        } else {
            localStorage.removeItem('OptHideConfirmUrgent');
        }
    });

    //CHANGE BACKGROUND IMAGE
    var bg = document.getElementsByClassName('overlay-bg');
    var bgClass = bg[0];

    var changeBgImg = document.querySelectorAll('#bgOptions > span');
    for (var i = 0; i < changeBgImg.length; i++) {

        changeBgImg[i].addEventListener('click', function () {

            /* Removing the class attribute from all the children of the parent node. */
            var allOpt = this.parentNode.children;
            for (var x = 0; x < allOpt.length; x++) {

                if (window.CP.shouldStopExecution(1)) {
                    break;
                }

                allOpt[x].removeAttribute('class');
            }

            window.CP.exitedLoop(1);

            this.classList.add('selected');
            if (this.innerText.toLowerCase() == 'none') bgClass.className = 'overlay-bg';

            /* Changing the background of the page. */
            if (this.innerText.toLowerCase() == 'url') {

                bgClass.className = 'overlay-bg';

                elem('byUrl').style.display = 'block';

                if (localStorage.getItem('OptBackgroundImageUrl') !== null) {
                    bgClass.setAttribute('style', 'background-image:url(' + localStorage.getItem('OptBackgroundImageUrl') + ') #fff0;');
                }
            } else {
                bgClass.removeAttribute('style');
                elem('byUrl').removeAttribute('style');
                bgClass.className = 'overlay-bg ' + this.innerText.toLowerCase();

            }
            localStorage.setItem('OptBackgroundImage', this.innerText);

        });


    }

    /* Importing a file and storing it in localStorage. */
    var inputImport = elem('impFile');
    inputImport.addEventListener('change', () => {
        var files = inputImport.files;
        if (files.length == 0) return;
        const file = files[0];
        var reader = new FileReader();
        reader.onload = (e) => {
            const file = e.target.result;
            const lines = file.split(/\r\n|\n/);
            var toImport = lines.join('\n');
            var byLine = toImport.split("\n");
            for (var i = 0; i < byLine.length - 1; i++) {
                var toStore = byLine[i].split(' : ');
                localStorage.setItem(toStore[0], toStore[1]);
            }
        };
        reader.onerror = (e) => alert(e.target.error.name);
        reader.readAsText(file);

        location.href = location.href;

    });

   /* The below code is checking if the local storage is not null. If it is not null, it will set the
   innerHTML of the ul-todo, ul-working, and ul-done to the local storage. If the local storage is
   not null, it will add the class fourCol to the myLists. It will also create a new div and set the
   innerHTML to the new div. It will also set the id of the new div to ur-gent. It will then insert
   the new div before the do-ne div. It will also add the active class to */
    if (localStorage.getItem('listToDo') != null) {
        elem('ul-todo').innerHTML = localStorage.getItem('listToDo');
        elem('ul-working').innerHTML = localStorage.getItem('listWorking');
        elem('ul-done').innerHTML = localStorage.getItem('listDone');

        /* Checking if the local storage item 'listUrgent' is not null. If it is not null, it adds the
        class 'fourCol' to the element with the id 'myLists'. It then creates a new div element and
        sets the innerHTML to the text '<h3>Urgent <span></span></h3><ul id="ul-urgent"
        class="section" ondrop="drop(event, this)" ondragover="allowDrop(event)"
        ondragenter="dragEnter(event)" ondragleave="dr */
        if (localStorage.getItem('listUrgent') !== null) {
            elem('myLists').classList.add('fourCol');
            var newBoard = document.createElement("div");
            newBoard.innerHTML = '<h3>Urgent <span></span></h3><ul id="ul-urgent" class="section" ondrop="drop(event, this)" ondragover="allowDrop(event)" ondragenter="dragEnter(event)" ondragleave="dragLeave(event)"></ul>';
            newBoard.setAttribute('id', 'ur-gent');
            elem('myLists').insertBefore(newBoard, elem('do-ne'));

            elem('addUrgent').parentNode.classList.add("active");

            if (localStorage.getItem('listUrgent') != '') {
                elem('ul-urgent').innerHTML = localStorage.getItem('listUrgent');

            }
        } 

    }

    /* Checking if the localStorage item 'OptShowOptions' is not null. If it is not null, it will
    toggle the class 'opened' on the element with the class 'options'. It will also change the text
    of the element with the id 'openOptions' to 'CLOSE'. */
    if (localStorage.getItem('OptShowOptions') !== null) {
        document.querySelector('.options').classList.toggle('opened');
        elem('openOptions').innerText = 'CLOSE';
    }
   /* Setting the background image to the one that was selected in the options menu. */
    if (localStorage.getItem('OptBackgroundImage') !== null) {
        var x = document.querySelectorAll('#bgOptions > span');
        for (var i = 0; i < x.length; i++) {
            if (x[i].innerText == localStorage.getItem('OptBackgroundImage')) {
                if (localStorage.getItem('OptBackgroundImage') != 'URL') {
                    x[i].click();
                } else {
                    x[i].classList.add('selected');
                    elem('bg-image').setAttribute('style', 'background-image:url(' + localStorage.getItem('OptBackgroundImageUrl') + ')');
                }
            }
        }
    }
    /* Checking if the localStorage item 'OptFullBoard' exists. If it does, it clicks the checkbox. */
    if (localStorage.getItem('OptFullBoard') !== null) {
        elem('boardFull').click();
    }
    /* Checking if the localStorage item OptOpacityLevel exists. If it does, it sets the value of the
    boardOpac element to the value of the OptOpacityLevel localStorage item. It then calls the
    showOpac function with the value of the OptOpacityLevel localStorage item. */
    if (localStorage.getItem('OptOpacityLevel') !== null) {
        elem('boardOpac').value = localStorage.getItem('OptOpacityLevel');
        showOpac(localStorage.getItem('OptOpacityLevel'));
    }
    /* Checking if the localStorage item 'OptHideConfirm' is set. If it is, it removes the class
    'showWng' from the element with the class 'deleteWarnig'. It also changes the text of the
    element with the id 'textWarning' to 'SHOW'. If the localStorage item 'OptHideConfirm' is not
    set, it adds the class 'showWng' to the element with the class 'deleteWarnig'. It also changes
    the text of the element with the id 'textWarning' to 'HIDE'. */
    if (localStorage.getItem('OptHideConfirm') !== null) {
        document.querySelector('.deleteWarnig').classList.remove('showWng');
        elem('textWarning').innerHTML = 'SHOW';
    } else {
        document.querySelector('.deleteWarnig').classList.add('showWng');
        elem('textWarning').innerHTML = 'HIDE';
    }


    changeTask();

    calcUpDown();

    countTask();


})();

