
/*** FUNCTIONS ***/

/**
* Returns the element with the given id. This is a convenience function for document. getElementById. The id can be anything that you pass to id () as an argument or a string of that id.
* 
* @param id - The id of the element to return. If it is a string it is assumed to be the name of an element in the document.
* 
* @return { HTMLElement } The element with the given id or null if not found ( for example if there is no element with that id
*/
function elem(id){
  var e = document.getElementById(id);
  return e;
}

/**
* Prevent dropping the form. This is a workaround for IE9 and IE9 + which don't have drag and drop support
* 
* @param ev - The DOM Event object
*/
function allowDrop(ev) {
	ev.preventDefault();
}

/**
* Drag and drop function for data transfer. Copies the data from the mouse into the dragged element
* 
* @param ev - The DOM Event object
*/
function drag(ev) {
	ev.dataTransfer.setData("text", ev.target.id);
}

/**
* Handles drag and drop of boards. Moves the data to the DOM and calls countTask to count the number of tasks that were dragged and saveBoards to the database.
* 
* @param ev - The DOM Event object. Not used. This is the same as the parameter of _init.
* @param el - The DOM Element to append the data to. Not used
*/
function drop(ev, el) {
	ev.preventDefault();
	var data = ev.dataTransfer.getData("text");
	el.appendChild(elem(data));
	elem(data).removeAttribute('style');
	el.classList.remove('drag-enter');
	countTask();
	saveBoards();
}

/**
* Adds drag - enter class to element. Used to show dragging is finished. Note that this class is added in the middle of drag and drop events.
* 
*/
function dragEnter(e){
	e.target.classList.add('drag-enter');
}

/**
* Remove the drag - enter class when dragged into a node. This is used to make the mouse out of a node that is dragged into an element.
* 
* @param e - The event being handled. This is only used for the drag - enter class
*/
function dragLeave(e){
	e.target.classList.remove('drag-enter');
}

/**
* Remove task from drop list ( called when user clicks delete button in task list ) and remove it from
*/
function delTaskDrop(){
	var elemt = elem("delete-list");
	elemt.innerHTML = '';
}

/**
* This function changes the onclick handlers for the task list. It is called when the user clicks on a task
*/
function changeTask(){
	var taskList = document.querySelectorAll('.txt');
	// shows all the tasks in the list and shows the modal
	for(i=0;i<taskList.length;i++){
		/**
		* / / object / string. This is a bit complex. We need to be able to pass a string to the object
		*/
		taskList[i].onclick = function() {	
			showModal();
			okModal(this.parentNode.id);
		}
	}
}

/**
* Show / hides the modal box and overlay in the page to prevent double clicking on the modal
*/
function showModal(){
	var modalBox = elem('modalBox');
	modalBox.style.display='block';
	var modalOverlay = elem('modalOverlay');
	modalOverlay.style.display='block';
}

/**
* Called when a task is selected. This is the callback for the modal that is shown when the user clicks on the OK button
* 
*/
function okModal(id){
	var newText =  elem('taskText');
	var theTask = elem(id);
	var theTaskStyle = elem(id).parentNode.id;
	console.log(theTaskStyle);
	elem('modalBox').setAttribute('class','b-'+theTaskStyle)
	newText.value = theTask.childNodes[0].innerText;
	newText.select();
	globalID = id;	
}

/**
* Close the modal and hide the overlay when the modal is dismissed ( in order to avoid flicker
*/
function closeModal(){
	var modalBox = elem('modalBox');
	modalBox.style.display='none';
	var modalOverlay = elem('modalOverlay');
	modalOverlay.style.display='none';
}

/**
* Move boards up in case they were dragged. Saves the boards before moving them to the DOM
* 
*/
function upListener(e) {
	e.preventDefault();
	var wrapper = this.parentElement;
	// Inserts the wrapper s previous element sibling into the wrapper s parent node.
	if (wrapper.previousElementSibling){
		wrapper.parentNode.insertBefore(wrapper, wrapper.previousElementSibling);
		saveBoards();
	}
}


/**
* Moves boards to the right. This is a workaround for IE9 and IE9 - 9 which don't support down / up events
* 
*/
function downListener(e) {
	e.preventDefault();
	var wrapper = this.parentElement;
	// Inserts the next element sibling of the wrapper.
	if (wrapper.nextElementSibling){
		wrapper.parentNode.insertBefore(wrapper.nextElementSibling, wrapper);
		saveBoards();
	}
}


/**
* Save Boards to local storage for next time they are loaded. This is called on load so we don't need to call it every
*/
function saveBoards(){
	var toDoContent = elem('ul-todo').innerHTML;
	var workInContent = elem('ul-working').innerHTML;
	var doneContent = elem('ul-done').innerHTML;
	localStorage.setItem('listToDo',toDoContent);
	localStorage.setItem('listWorking',workInContent);
	localStorage.setItem('listDone',doneContent);
	// Set the urgent list item to the local storage.
	if(elem('ul-urgent') !== null){	
		var urgentContent = elem('ul-urgent').innerHTML;
		localStorage.setItem('listUrgent',urgentContent);
	} else {
		localStorage.removeItem('listUrgent');
	}
}
	
	
//change opacity
/**
* Shows or hides Opacity Level. It's used to show the board and set optical level
* 
*/
function showOpac(val){
	var zeroDot = '0.';
	var boardOpacNum = document.querySelectorAll('#myLists > div');
	// Set the background color of all the board opac numbers
	for(var i = 0; i<boardOpacNum.length; i++){
		// Zero dot is the zero dot of the value.
		if(val=='10') zeroDot = ''; 
		boardOpacNum[i].style.background = 'rgb(247 247 247 / '+zeroDot+val;
	}
	localStorage.setItem('OptOpacityLevel',val);
}
	
	
function delTask(ev,elemt){
	ev.preventDefault();
	if(localStorage.getItem('OptHideConfirm')!== null){
		elemt.remove();
		saveBoards();
		countTask();
		document.querySelector('.deleteWarnig').classList.remove('showWng');
	} else {
		elem('confirmTitle').innerHTML = 'THE TASK';
		elem('confirmDelete').style.display = 'block';
		elem('confirmBox').style.display = 'block';
		//confirm delete
		var delConfirm = elem("confirmBtn");
		/**
		* / / object / string. This is a bit complex. We need to be able to pass a string to the object
		*/
		delConfirm.addEventListener('click', function() {
			elemt.remove();
			saveBoards();
			countTask();
			elem('confirmDelete').style.display = 'none';
			elem('confirmBox').style.display = 'none';
		});
		//cancel delete
		var canConfirm = elem("confirmCls");
		/**
		* / / object / list object is used to determine the type of object that is being
		*/
		canConfirm.addEventListener('click', function() {
			elem('confirmDelete').style.display = 'none';
			elem('confirmBox').style.display = 'none';
		});
	}
}




//CHANGE LIST HEIGHT
/**
* Change the height of a list. This is called when the user toggles between full and full boards
*/
function changeListHeight(id){
	elem(id).classList.toggle('active');
	var boards = document.querySelectorAll('#myLists > div');
	// Show all the boards in the boards.
	for(var i=0; i<boards.length; i++){
		boards[i].classList.toggle('full');
	}
	elem('myLists').classList.toggle('full');
	var isActive = elem(id).getAttribute('class');
	// Set the full board state.
	if(isActive!=''){
		localStorage.setItem('OptFullBoard',isActive);
		elem('textHeight').innerHTML = 'ADJUST';
	} else {
		localStorage.removeItem('OptFullBoard'); 
		elem('textHeight').innerHTML = 'FULL';
	} 
}



//COUNT TASK
/**
* Count how many tasks are in the task section and display the total number in totalTask div. This is to avoid having to iterate over all tasks
*/
function countTask(){
	var cypher = document.querySelectorAll('.section');
	var totalNum = 0;
	// This function is used to update the total number of children of the cypher
	for(var i=0; i<cypher.length; i++){
		var num = cypher[i].childElementCount;
		var parent = cypher[i].parentNode;
		var childrn = parent.children[0];
		var nal = childrn.children[0];
		nal.innerHTML = num;
		totalNum += num;
	}
	elem('totalTask').innerHTML = totalNum;
}




//check if confirm
/**
* Hides / Shows the confirm box depending on user's choice. This is called on click
*/
function checkIfCnfr(){
	// Hide confirm confirmations in localStorage.
	if(localStorage.getItem('OptHideConfirm') !== null){
		localStorage.removeItem('OptHideConfirm');
		document.querySelector('.deleteWarnig').classList.add('showWng');
		elem('textWarning').innerHTML = 'HIDE';
	} else {
		localStorage.setItem('OptHideConfirm', 'true');
		document.querySelector('.deleteWarnig').classList.remove('showWng');
		elem('textWarning').innerHTML = 'SHOW';
	}
}



//delete options
/**
* Delete Options from local storage and reload the page after deletion has been done ( for ajax requests ) TODO
*/
function delOptions(){
	localStorage.removeItem('OptShowOptions');
localStorage.removeItem('OptBackgroundImage');
	localStorage.removeItem('OptFullBoard');
	localStorage.removeItem('OptOpacityLevel');
	localStorage.removeItem('OptHideConfirm');
localStorage.removeItem('OptHideConfirmUrgent');
	localStorage.removeItem('OptBackgroundImageUrl');
	location.href = location.href;
}




//toggle options
/**
* Opens / Closes options based on localStorage value and toggles the open / close textboxes on
*/
function openCloseOptions(){
	document.querySelector('.options').classList.toggle('opened');
	// This method is used to set the option show option to open or close the option.
	if(localStorage.getItem('OptShowOptions') !== null){
		localStorage.removeItem('OptShowOptions');
		elem('openOptions').innerText = 'OPEN';
	} else {
		localStorage.setItem('OptShowOptions','true');
		elem('openOptions').innerText = 'CLOSE';
	}
}




/**
* Set url and set opt - background - image to localstorage and overlay - bg to show image on
*/
function getUrl(){
	var imageUrl = elem('urlImage').value;
	localStorage.setItem('OptBackgroundImageUrl',imageUrl);
	var bg = document.getElementsByClassName('overlay-bg');
	var bgClass = bg[0];
	bgClass.setAttribute('style','background-image:url('+imageUrl+')');
	elem('byUrl').removeAttribute('style');
}



/**
* Exports the Board to local storage and shows it in the Explorer hidden div. This is a function to be called when the user clicks on the export
*/
function exportBoard(){
	// Download all the files in the local storage.
	if(localStorage.length == 0){
		alert('Nothing to export...');
	} else {
		var fileJKB = "";
		// Add the file to the fileJKB
		for (x=0; x<=localStorage.length-1; x++)  {  
		  fileJKB += localStorage.key(x) +' : '+ localStorage.getItem(localStorage.key(x)) + '\n' ;
		}
		var blob = new Blob([fileJKB],{type: "text/plain"}); 
		download(blob,"jkb-saved.txt"); 
		/**
		* Downloads a blob to the browser. This is a wrapper around the URL constructor and dispatches a click event to allow the browser to download the blob.
		* 
		* @param blob - The blob to download. This can be a URL or a string that can be parsed by URL. parse ().
		* @param name - The name of the download ( used in error messages )
		*/
		function download(blob,name) { 
			var url = URL.createObjectURL(blob);
			elem('expHidden').href = url; 
			elem('expHidden').download = name;
			
			var ev = new MouseEvent("click",{}); 
			elem('expHidden').dispatchEvent(ev); 
			
		}
	}
}

//import 
/**
* Imports the Board from file and click on it. This is a function to be called from the click event of the Import Board button
*/
function importBoard(){
	elem('impFile').click();
}


/**
* Show or hide help on page based on user input. This is called when the user clicks on the help
*/
function showHelp(){
	elem('helpContent').classList.toggle('active');
	elem('help').classList.toggle('showing');
}
