import React from 'react'

const Home = ({toggle}) => {
    return (
        <div className="herosection">
            <div className="image">
            <img className='himg' src="hero_section.png" alt="hero_section.png"/>
            </div>
            <div className="herotext">
                <p className='herotext1'>DICE GAME</p>
                <button onClick={toggle} className='playbtn'>Play Now</button>
            </div>
        </div>

    )
}

export default Home
