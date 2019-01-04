import React from 'react'
import profileImage from '../../assets/profile-image.png'

const SearchMenuItem = props => {
  const user = props.user

  const userClicked = () => {
    props.history.push({
      pathname: '/profile',
      state: { id: user._id },
    })
  }

  const handleKeyPress = (event) => {
    console.log(event.key)
    if (event.key == 'Enter') {
      console.log('enter press here! ')
      userClicked()
    }
  }

  return (
    <div onClick={userClicked} onKeyDown={handleKeyPress}>
      <img
        src={profileImage}
        style={{
          height: '24px',
          marginRight: '10px',
          width: '24px',
        }}
      />
      <span>{user.lastname + ' ' + user.givenNames}</span>
    </div>
  )
}

export default SearchMenuItem
