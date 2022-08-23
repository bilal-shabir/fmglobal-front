// import namor from 'namor'
import Cookies from 'universal-cookie';
import {DKEY} from './constants'



export var checkpermision =function(input) {
      let permission = localStorage.getItem('permissions');
      var CryptoJS = require("crypto-js");
      var bytes = CryptoJS.AES.decrypt(permission, DKEY);
      var permissions = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      if(!permissions.find((permission) => permission.name === input ) ){
        window.location.replace("/"+permissions[0].name);
      }
}

export const checkLanguage = () => {
  const cookies = new Cookies();
  const currentLanguageCode = cookies.get('i18next') || 'en'
  return (currentLanguageCode==='ar')
}
 // const range = len => {
//   const arr = []
//   for (let i = 0; i < len; i++) {
//     arr.push(i)
//   }
//   return arr
// }

// const newPerson = () => {
//   const statusChance = Math.random()
//   return {
//     firstName: namor.generate({ words: 1, numbers: 0 }),
//     lastName: namor.generate({ words: 1, numbers: 0 }),
//     age: Math.floor(Math.random() * 30),
//     visits: Math.floor(Math.random() * 100),
//     progress: Math.floor(Math.random() * 100),
//     status:
//       statusChance > 0.66
//         ? 'relationship'
//         : statusChance > 0.33
//         ? 'complicated'
//         : 'single',
//   }
// }

// export default function makeData(...lens) {
//   const makeDataLevel = (depth = 0) => {
//     const len = lens[depth]
//     return range(len).map(d => {
//       return {
//         ...newPerson(),
//         subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
//       }
//     })
//   }

//   return makeDataLevel()
// }

