module.exports = function(state, __) {
	switch(state){
	case 'in-progress':
		return __('InProgress');
	case 'finished':
		return __('Finished');
	}
};