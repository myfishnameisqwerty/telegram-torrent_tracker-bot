function ipToInt32(ip){
  
  let splited= (ip.split('.').map((el, i) => {
    let bin = parseInt(el).toString(2)
    return new Array(8-bin.length).fill('0').join('')+bin
    
  }))
  return parseInt(splited.join(''), 2)
}
console.log(ipToInt32("128.32.10.1"));