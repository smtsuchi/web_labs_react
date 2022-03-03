import React, { useContext, useState } from 'react';

const CurrentUserContext = React.createContext()
const CurrentUserUpdateContext = React.createContext()

const useCurrentUser = () => {return useContext(CurrentUserContext)}
const useSetCurrentUser = () => {return useContext(CurrentUserUpdateContext)}

const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({token:'',username:'', lessons: []});

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <CurrentUserUpdateContext.Provider value={setCurrentUser}>
        { children }
      </CurrentUserUpdateContext.Provider>
    </CurrentUserContext.Provider>
  )
};

export { useCurrentUser, useSetCurrentUser };
export default CurrentUserProvider;