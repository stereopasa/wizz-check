import {replaceSpaces} from '../utils/StringUtils'

let arr: Array<string> = ["abc", "acb"];

arr = arr.map(el => {
    return el.replace(/a/i, "@")
})

console.log(arr);


let s = `Originally released October 2016<br> 13.3-inch (diagonal) LED-backlit display; 2560-by-1600 native resolution
at 227 pixels per inch<br> 16GB of 1866MHz LPDDR3 onboard memory<br> 256GB PCIe-based onboard SSD<br> 720p
FaceTime HD Camera<br> Intel Iris Graphics 540`

let a = s.split("<br>")
.map(line => replaceSpaces(line));

console.log(JSON.stringify(a))