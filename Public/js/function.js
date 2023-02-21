
/*** FUNCTIONS ***/

function elem(id){
  var e = document.getElementById(id);
  return e;
}

function allowDrop(ev) {
	ev.preventDefault();
}

function drag(ev) {
	ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev, el) {
	ev.preventDefault();
	var data = ev.dataTransfer.getData("text");
	el.appendChild(elem(data));
	elem(data).removeAttribute('style');
	el.classList.remove('drag-enter');
	countTask();
	saveBoards();
}

function dragEnter(e){
	e.target.classList.add('drag-enter');
}

function dragLeave(e){
	e.target.classList.remove('drag-enter');
}

function delTaskDrop(){
	var elemt = elem("delete-list");
	elemt.innerHTML = '';
}

function changeTask(){
	var taskList = document.querySelectorAll('.txt');
	for(i=0;i<taskList.length;i++){
		taskList[i].onclick = function() {	
			showModal();
			okModal(this.parentNode.id);
		}
	}
}

function showModal(){
	var modalBox = elem('modalBox');
	modalBox.style.display='block';
	var modalOverlay = elem('modalOverlay');
	modalOverlay.style.display='block';
}

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

function closeModal(){
	var modalBox = elem('modalBox');
	modalBox.style.display='none';
	var modalOverlay = elem('modalOverlay');
	modalOverlay.style.display='none';
}
// var closeBox = elem('modalClose');
// closeBox.onclick=closeModal;
// var closeOverlay = elem('modalOverlay');
// closeOverlay.onclick=closeModal;


function upListener(e) {
	e.preventDefault();
	var wrapper = this.parentElement;
	if (wrapper.previousElementSibling){
		wrapper.parentNode.insertBefore(wrapper, wrapper.previousElementSibling);
		saveBoards();
	}
}


function downListener(e) {
	e.preventDefault();
	var wrapper = this.parentElement;
	if (wrapper.nextElementSibling){
		wrapper.parentNode.insertBefore(wrapper.nextElementSibling, wrapper);
		saveBoards();
	}
}


function saveBoards(){
	var toDoContent = elem('ul-todo').innerHTML;
	var workInContent = elem('ul-working').innerHTML;
	var doneContent = elem('ul-done').innerHTML;
	localStorage.setItem('listToDo',toDoContent);
	localStorage.setItem('listWorking',workInContent);
	localStorage.setItem('listDone',doneContent);
	if(elem('ul-urgent') !== null){	
		var urgentContent = elem('ul-urgent').innerHTML;
		localStorage.setItem('listUrgent',urgentContent);
	} else {
		localStorage.removeItem('listUrgent');
	}
}
	
	
//change opacity
function showOpac(val){
	var zeroDot = '0.';
	var boardOpacNum = document.querySelectorAll('#myLists > div');
	for(var i = 0; i<boardOpacNum.length; i++){
		if(val=='10') zeroDot = ''; 
		boardOpacNum[i].style.background = 'rgb(247 247 247 / '+zeroDot+val;
	}
	localStorage.setItem('OptOpacityLevel',val);
}
	
	
//delete task
function delTask(ev,elemt){
	ev.preventDefault();
	if(localStorage.getItem('OptHideConfirm')!== null){
		//borrar del tiron
		elemt.remove();
		saveBoards();
		countTask();
		document.querySelector('.deleteWarnig').classList.remove('showWng');
	} else {
		//preguntar antes
		elem('confirmTitle').innerHTML = 'THE TASK';
		elem('confirmDelete').style.display = 'block';
		elem('confirmBox').style.display = 'block';
		//confirm delete
		var delConfirm = elem("confirmBtn");
		delConfirm.addEventListener('click', function() {
			elemt.remove();
			saveBoards();
			countTask();
			elem('confirmDelete').style.display = 'none';
			elem('confirmBox').style.display = 'none';
		});
		//cancel delete
		var canConfirm = elem("confirmCls");
		canConfirm.addEventListener('click', function() {
			elem('confirmDelete').style.display = 'none';
			elem('confirmBox').style.display = 'none';
		});
	}
}




//CHANGE LIST HEIGHT
function changeListHeight(id){
	elem(id).classList.toggle('active');
	var boards = document.querySelectorAll('#myLists > div');
	for(var i=0; i<boards.length; i++){
		boards[i].classList.toggle('full');
	}
	elem('myLists').classList.toggle('full');
	var isActive = elem(id).getAttribute('class');
	if(isActive!=''){
		localStorage.setItem('OptFullBoard',isActive);
		elem('textHeight').innerHTML = 'ADJUST';
	} else {
		localStorage.removeItem('OptFullBoard'); 
		elem('textHeight').innerHTML = 'FULL';
	} 
}



//COUNT TASK
function countTask(){
	var cypher = document.querySelectorAll('.section');
	var totalNum = 0;
	for(var i=0; i<cypher.length; i++){
		var num = cypher[i].childElementCount;
		//console.log(num);
		var parent = cypher[i].parentNode;
		var childrn = parent.children[0];
		var nal = childrn.children[0];
		nal.innerHTML = num;
		totalNum += num;
	}
	elem('totalTask').innerHTML = totalNum;
}




//check if confirm
function checkIfCnfr(){
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
function delOptions(){
	localStorage.removeItem('OptShowOptions');
localStorage.removeItem('OptBackgroundImage');
	localStorage.removeItem('OptFullBoard');
	localStorage.removeItem('OptOpacityLevel');
	localStorage.removeItem('OptHideConfirm');
localStorage.removeItem('OptHideConfirmUrgent');
	localStorage.removeItem('OptBackgroundImageUrl');
	location.href = location.href;
//location.reload();		
}




//toggle options
function openCloseOptions(){
	document.querySelector('.options').classList.toggle('opened');
	if(localStorage.getItem('OptShowOptions') !== null){
		localStorage.removeItem('OptShowOptions');
		elem('openOptions').innerText = 'OPEN';
	} else {
		localStorage.setItem('OptShowOptions','true');
		elem('openOptions').innerText = 'CLOSE';
	}
}




//url img by
function getUrl(){
	var imageUrl = elem('urlImage').value;
	localStorage.setItem('OptBackgroundImageUrl',imageUrl);
	var bg = document.getElementsByClassName('overlay-bg');
	var bgClass = bg[0];
	bgClass.setAttribute('style','background-image:url('+imageUrl+')');
	elem('byUrl').removeAttribute('style');
}



//export
function exportBoard(){
	if(localStorage.length == 0){
		alert('Nothing to export...');
	} else {
		var fileJKB = "";
		for (x=0; x<=localStorage.length-1; x++)  {  
		  fileJKB += localStorage.key(x) +' : '+ localStorage.getItem(localStorage.key(x)) + '\n' ;
		}
		var blob = new Blob([fileJKB],{type: "text/plain"}); 
		download(blob,"jkb-saved.txt"); 
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
function importBoard(){
	elem('impFile').click();
}


//help
function showHelp(){
	elem('helpContent').classList.toggle('active');
	elem('help').classList.toggle('showing');
}
