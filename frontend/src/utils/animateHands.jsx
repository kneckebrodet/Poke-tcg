export async function animateHands(playerOneInitHand, playerTwoInitHand, setPlayerOneHand, setPlayerTwoHand) {
    const p1 = [];
    const p2 = [];

    for (let i = 0; i < playerOneInitHand.length; i++) {
        if (playerOneInitHand){
            p1.push(playerOneInitHand[i]);
            setPlayerOneHand([...p1]);
        }
        if (playerTwoInitHand) {
            p2.push(playerTwoInitHand[i]);
            setPlayerTwoHand([...p2]);
        }


        await new Promise(resolve => setTimeout(resolve, 100));
    }
}