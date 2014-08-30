var utilities = {
  randomArrayPick: function(arr){
    return arr[parseInt( Math.random() * (arr.length - 1) )];
  },
  namingAlg: function(sounds){
    var name = '', _this = this;
    for( i=0; i<3; i++ ) {
      name += _this.randomArrayPick(sounds);
    }
    return name = name[0].toUpperCase() + name.slice(1);
  }
}
