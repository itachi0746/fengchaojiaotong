import utils from './utils'
import { postData } from './server'
window.GoToPage = utils.goToPage
window.utils = utils
window.toQuery = function toQuery(obj) {
  var theItems = [];
  for (var key in obj) {
    if (obj[key] == undefined || obj[key] == null) {
      theItems.push(key + "=" + (obj[key] || ''));
    }
    else {
      theItems.push(key + "=" + (obj[key]));
    }

  }
  return theItems.join("&");
}
export { postData, utils }
