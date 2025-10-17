import { useSelector } from 'react-redux';
import { selectPermissions } from '../redux/common/selectors';

export const useHasPermission = (requiredPermissions, userPermissions) => {

    if(!userPermissions) {
      var userPermissions = useSelector(selectPermissions);
    }
    
    if (!Array.isArray(requiredPermissions)) {
      requiredPermissions = [requiredPermissions];
    }
  
    // Return true if the user has at least one of the required permissions
    return requiredPermissions.some(permission => userPermissions.includes(permission));
};