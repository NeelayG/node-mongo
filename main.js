$(document).ready(function(){
	$('.deleteUser').on('click', deleteUser);
});

function deleteUser(){
var conf=confirm('Are you sure');
if(conf){
$.ajax({
	type:'DELETE',
	url: '/users/delete/'+$(this).data('id')
}).done(function(response){
	window.location.replace('/');
});
	window.location.replace('/');

}else{
	return false;
}
}