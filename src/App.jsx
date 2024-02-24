import React, {useState} from 'react'
import he from 'he'
import IntroPage from './Components/IntroPage'
import Questions from './Components/Questions'
import {nanoid} from 'nanoid'

function App() {

  const [activeGame, setActiveGame] = useState(false);
  const [quizData, setQuizData] = useState([]);
  const [showScore, setShowScore] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5);

  async function fetchQuizData(){
    try {
      const response = await fetch('https://opentdb.com/api.php?amount=5&category=9&difficulty=easy&type=multiple');
      const data = await response.json();

      const updatedResults = data.results.map(question => ({
        prompt: he.decode(question.question),
        correct_answer: he.decode(question.correct_answer),
        incorrect_answers: question.incorrect_answers.map(x => he.decode(x)),
        allAnswers: shuffleArray([...question.incorrect_answers, question.correct_answer].map(answer => he.decode(answer))),
        id:nanoid(),
        // optional property, not essential
        checked:false,
        // check wether this specific question has been answered
          // will be used to decide wether we can submit our quiz and start checking answers
        selected:null
        // wasCorrect:false?
      }));
      const updatedData = {
        // ...data,
        results: updatedResults,
      };
      await setQuizData(updatedData.results); 

    }catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
  async function startGame(){
    await fetchQuizData();
    await setActiveGame(prevState=>!prevState);
    console.log('fetch function has run now, activeGame state is flipped')
  }
  console.log(quizData)

  function calculateQuizScore(){
    // calculate the count of correctly answered questions
    let correctCount=0
    quizData.forEach((question)=>{
      if(question.selected === question.correct_answer){
        correctCount = correctCount + 1;
      }
      question.checked = true
    })
    return correctCount;
  }

  function handleSubmit(){
    // quizScore = await calculateQuizScore();
    // if all answers have been selected then proceed
    if(quizData.every(question=>question.selected!=null)){
      setQuizScore(calculateQuizScore())
      setShowScore(score =>!score)
    }
  }

  function handleClickAnswer(id,answer){
    // iterate through the quizData and set..
    // the selected value for that specific question to the answer value passed here
    // console.log('answer is: ',answer,'and the id for its specific question block is: ', id)
    setQuizData(oldQuizData=>oldQuizData.map(question=>{
      // if the current question has a matching id to the one passed
      return question.id === id ?{
        ...question,
        selected:answer
      }
      // else just return that question as is
      :question
    }))
    console.log('updated data: ',quizData)
  }
  function restartQuiz(){
    // reset score back to 0
    setQuizScore(0);
    setShowScore(false)
    // get new data
    fetchQuizData();
    // setCalculateScore(false);
  }
  async function home(){
    await setActiveGame(game=>!game);
    restartQuiz();
   
  }
  const questionElements = quizData.map((question)=>(
    <Questions
      key={question.id}
      // all data for specific question
      question={question}
      handleClickAnswer = {handleClickAnswer}
      id = {question.id}
      allSelected = {showScore}
    />
  ))
  
  return(
    <div className ='main--container'>

      {/* if game is active render question elements alongside conditional rendering of buttons */}
      {activeGame ? 
          <section>
            <div className='questions--component--container'>
              {/* change to appropriate class name */}
              <h1 className='intro--title'>Quizzical</h1>
              {questionElements}
            </div>
            <div className = 'results--container'>
              {/* if we wish to showScore, render score as well as restart button*/}
              {showScore ? 
                <div className = 'questions--quizScore'>
                  {/* change to appropraite class name */}
                  <h4 className = 'intro--title'>Your Score is: {quizScore}/5</h4>
                  <button className = 'submitQuiz--button' onClick={restartQuiz}>Take Another Quiz</button>
  
                </div>
              // if we dont wish to show Score, render submit button to calc. score
              :
                <button className='submitQuiz--button' onClick={handleSubmit}>Submit Quiz</button> 
              }
                <button className = 'submitQuiz--button' onClick={home}>Go Back Home</button>
            </div>
          </section>
      :
        
        <div className='intro--container'>
            <IntroPage />
            <button className="startQuiz--button" onClick={startGame}>Start Game</button>
        </div>
      }
     </div>
    
  )
}

export default App
