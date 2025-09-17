import React from 'react'

function LayOut({children}) {
  return (
    <div>
        <Header/>
        {children}
    </div>
  )
}

export default LayOut