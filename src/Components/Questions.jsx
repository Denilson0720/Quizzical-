import React from 'react'
export default function Question({question,handleClickAnswer,id,allSelected}){

    const styles={
        backgroundColor:question.selected === question.correct_answer?'rgb(172, 225, 147)':'#f28482'
    }
    const answerElements = question.allAnswers.map((answer,index)=>{
        return(
            <div className = {answer === question.selected?'questions--options--selected':'questions--options'} key={`${id}-${index}`}>
                <button style={allSelected && answer==question.selected?styles:null}  onClick={()=>handleClickAnswer(id,answer)}>
                    {answer}
                </button>
            </div>
        )
    })
    return(
        <div className = 'questions--component'>
            <h2 className = 'questions--prompt'>{question.prompt}</h2>
            {answerElements}
        </div>
        
    )
}