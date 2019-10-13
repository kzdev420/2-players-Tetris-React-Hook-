import React, { useState } from 'react';
import { createStage, checkCollision } from '../gameHelpers';

//styled components
import {StyledTetrisWrapper, StyledTetris} from './styles1/StyledTetris';

//custom hooks
import { useInterval } from '../hooks/useInterval';
import { usePlayer } from '../hooks/usePlayer';
import { useStage } from '../hooks/useStage';
import { useGameStatus } from '../hooks/useGameStatus';

//components
import Stage from './Stage'
import Display from './Display';
import StartButton from './StartButton';

const Tetris = ({ type }) => {

    const [gameOver, setGameOver] = useState(false);

    const [dropTime, setDropTime] = useState(null);
    const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
    const [player1, updatePlayerPos1, resetPlayer1, playerRotate1] = usePlayer();
    const [stage, setStage, rowsCleared] = useStage(player, resetPlayer, player1,resetPlayer1);
    const [stage1, setStage1, rowsCleared1] = useStage(player1,resetPlayer1);
    const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(
        rowsCleared
    );

    const [dropTime1, setDropTime1] = useState(null);
    
    
    const [score1, setScore1, rows1, setRows1, level1, setLevel1] = useGameStatus(
        rowsCleared1
    );


    console.log('re-render');

    const startGame = () => {
        //Reset everything
        setGameOver(false);

        setStage(createStage());
        setDropTime( 1000 / (level + 1) + 200);        
        resetPlayer();
        setScore(0);
        setRows(0);
        setLevel(0);
        
        setStage1(createStage())
        setDropTime1( 1000 / (level + 1) + 200);
        resetPlayer1();
        setScore1(0);
        setRows1(0);
        setLevel1(0);
    }

    const movePlayer = dir => {
        setDropTime( 1000 / (level + 1) + 200);
        if(!checkCollision(player, stage, {x: dir, y: 0})){
            updatePlayerPos( { x: dir, y: 0});
        }
    }

    const movePlayer1 = dir => {
        setDropTime( 1000 / (level + 1) + 200);
        if(!checkCollision(player1, stage1, {x: dir, y: 0})){
            updatePlayerPos1( { x: dir, y: 0});
        }
    }

    const playerdrop = () => {
        //Increase level when player has cleared 10 rows
        if( rows > (level + 1) * 10){
            setLevel( prev => prev + 1);
            //also increase speed
            setDropTime( 1000 / (level + 1) + 200);
        }
        if(!checkCollision(player, stage, {x: 0, y: 1})){
            updatePlayerPos({ x: 0, y: 1, collided: false })
        } else {
            //Game Over
            if(player.pos.y < 1){
                console.log("GAME OVER!!!");
                setGameOver(true);
                setDropTime(null);
                setDropTime1(null);
                return;
            }
            updatePlayerPos({ x: 0, y: 0, collided: true });
            setDropTime(null);
            setDropTime( 1000 / (level + 1) + 200);
        }
    }

    const player1drop = () => {
        //Increase level when player has cleared 10 rows
        if( rows1 > (level1 + 1) * 10){
            setLevel1( prev => prev + 1);
            //also increase speed
            setDropTime1( 1000 / (level1 + 1) + 200);
        }
        if(!checkCollision(player1, stage1, {x: 0, y: 1})){
            updatePlayerPos1({ x: 0, y: 1, collided: false })
        } else {
            //Game Over
            if(player1.pos.y < 1){
                console.log("GAME OVER!!!");
                setGameOver(true);
                setDropTime(null);
                setDropTime1(null);
                return;
            }
            updatePlayerPos1({ x: 0, y: 0, collided: true });
            setDropTime1(null);
            setDropTime1( 1000 / (level1 + 1) + 200);
        }
    }

    const keyUp = ({ keyCode }) => {
        if(!gameOver){
            if(keyCode === 40){
                console.log("interval on");
                setDropTime( 1000 / (level + 1) + 200);
            }
            if(keyCode === 83){
                console.log("interval on");
                setDropTime1( 1000 / (level1 + 1) + 200);
            }
        }
    }

    const dropPlayer = () => {
        console.log("interval off");
        setDropTime(null);
        playerdrop();
    }

    const dropPlayer1 = () => {
        console.log("interval off");
        setDropTime1(null);
        player1drop();
    }

    const move = ({ keyCode }) => {

        if(!gameOver){
            if(keyCode === 37){
                movePlayer(-1);
            } else if(keyCode === 39){
                movePlayer(1);
            } else if(keyCode === 40){
                dropPlayer();
            } else if (keyCode === 38){
                playerRotate(stage, 1);
            } else if( keyCode === 17){
                setDropTime(0);
                playerdrop();
            }

            if(keyCode === 65){
                movePlayer1(-1);
            } else if(keyCode === 68){
                movePlayer1(1);
            } else if(keyCode === 83){
                dropPlayer1();
            } else if (keyCode === 87){
                playerRotate1(stage1, 1);
            } else if( keyCode === 16){
                setDropTime1(0);
                player1drop();
            }

        }

    }

    useInterval(() => {
        playerdrop();
    }, dropTime)
    useInterval(() => {
        player1drop();
    }, dropTime1)

    return(
            <StyledTetrisWrapper 
                role="button" 
                tabIndex="0" 
                onKeyDown = {e => move(e)} 
                onKeyUp = {keyUp}
            >
                <StyledTetris>
                    <Stage stage = {stage1}/>
                    <aside>
                        {gameOver ? (
                            <Display gameOver={gameOver} text="Game Over" />
                        ) : (
                            <div>
                                <Display text = {`Score: ${score1} : ${score}`}/>
                                <Display text = {`Rows: ${rows1} : ${rows}`}/>
                                <Display text = {`Level: ${level1} : ${level}`}/>
                            </div>
                        )}
                        < StartButton callback={startGame} />
                    </aside>
                    <Stage stage = {stage}/>
                </StyledTetris>
            </StyledTetrisWrapper>
    );
};

export default Tetris;