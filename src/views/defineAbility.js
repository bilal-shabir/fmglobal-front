
import { defineAbility } from '@casl/ability';

export default function setPermissions(user) {
  return defineAbility((can, cannot) => {
      // console.log('here',user)
      const array = user.Resources
    for (let index = 0; index < array.length; index++) {
        // console.log(array[index])
        // can(`${user.resources[index].action}`, user.resources[index].subject)
        for (let index2 = 0; index2 < array[index].action.length; index2++) {
            can(array[index].action[index2], array[index].subject)
            
        }
        
    }
//    console.log(ability)
  });
}