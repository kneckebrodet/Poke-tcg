import HandRow from './HandRow'
import PriceRow from './PriceRow'
import DeckPile from './DeckPile'
import TrashPile from './TrashPile'
import ActiveRow from './ActiveRow'
import BenchRow from './BenchRow'

function PlayerSide({ data, onPrizeClick, onHandClick, onBenchClick, onActiveClick, onDeckClick, onTrashClick, isOpponent}) {
  if (isOpponent) {
    // Opponent side layout mirrored:
    return (
      <div className='flex justify-center gap-[10vw] border-2 h-[50%] bg-red-400'>
        <div className='flex flex-col justify-center items-center gap-[5vh] w-[15vw]'>
          <DeckPile cards={data.deck} onClick={onDeckClick} />
          <TrashPile cards={data.trash} onClick={onTrashClick} />
        </div>
        <div className='flex flex-col justify-between items-center gap-[1.5vh]'>
          <HandRow cards={data.hand} onClick={onHandClick} />
          <BenchRow cards={data.bench} onClick={onBenchClick} />
          <ActiveRow cards={data.active} onClick={onActiveClick} />
        </div>
        <div className='flex flex-col justify-center items-center w-[15vw]'>
          <PriceRow cards={data.prize} onClick={onPrizeClick} />
        </div>
      </div>
    )
  } else {
    return (
      <div className='flex justify-center gap-[10vw] border-2 h-[50%] bg-white'>
        <div className='flex flex-col justify-center items-center w-[15vw]'>
          <PriceRow cards={data.prize} onClick={onPrizeClick} />
        </div>
        <div className='flex flex-col justify-between items-center gap-[1.5vh]'>
          <ActiveRow cards={data.active} onClick={onActiveClick} />
          <BenchRow cards={data.bench} onClick={onBenchClick} />
          <HandRow cards={data.hand} onClick={onHandClick} />
        </div>
        <div className='flex flex-col justify-center items-center gap-[5vh] w-[15vw]'>
          <DeckPile cards={data.deck} onClick={onDeckClick} />
          <TrashPile cards={data.trash} onClick={onTrashClick} />
        </div>
      </div>
    )
  }
}

export default PlayerSide