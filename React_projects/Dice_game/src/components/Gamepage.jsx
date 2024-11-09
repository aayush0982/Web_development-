import React from 'react'
import { useState } from 'react'



const Gamepage = () => {
  const [Numchoice, setNumchoice] = useState(0);
  const [Scorenum, setScorenum] = useState(0);
  const [Dicechoice, setDicechoice] = useState(1);
  const [isVisible, setisVisible] = useState(false)

  const handleClick = (num) => {
    setNumchoice(num);
  };
  // console.log(Numchoice)

  // const changeopacity = ()=>{
  //   setisVisible(true)
  // }

  const rnum = (min, max) => {
    const Random = Math.floor(Math.random() * (max - min) + min);
    setDicechoice(Random);

    if (Numchoice === Random) {
      setScorenum((prev) => prev + Random);
    } else {
      setScorenum((prev) => prev - 2);
    }

    console.log("Random:", Random, "Scorenum:", Scorenum);
  };

  return (
    <div>
      {/* Game code will be written here */}

      <div className="upperbar">
        <div className="score">
          <p className="scnum">{Scorenum}</p>
          <p className="sctext">Total Score</p>
        </div>
        <div className="dicenumchoice">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <div
              key={num}
              className={`dice ${Numchoice === num ? 'active' : ''}`}
              onClick={() => handleClick(num)}
            >
              {num}
            </div>
          ))}
        </div>
      </div>

      <div className="lowerpart">
        <div className="diceimg">
          <img className='dimg' onClick={()=> rnum(1,7)} src={`dice_${Dicechoice}.png`} alt="dice_png" />
        </div>
        <div className="btns">
        <button onClick={()=> setScorenum(0)} className='resbtn'>Reset Score</button>
        <button onClick={()=> setisVisible(!isVisible)}  className='rulebtn'>Show Rules</button>
        </div>
        <div className={`rules ${isVisible ? 'visible' : ''}`}>
          <h2>How to play dice game</h2>
          <div className="subtext">
            <p>1. Select any number</p>
            <p>2. Click on dice image</p>
            <p>3. After click on  dice  if selected number is equal to dice number you will get same point as dice </p>
            <p>4. If you get wrong guess then  2 point will be dedcuted </p>
          </div>
        </div>
      </div>


    </div>
  )
}

export default Gamepage
