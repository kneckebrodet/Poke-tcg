import HandRow from './HandRow'
import PriceRow from './PriceRow'
import DeckPile from './DeckPile'
import TrashPile from './TrashPile'
import ActiveRow from './ActiveRow'
import BenchRow from './BenchRow'

function PlayerSide({ data, onPrizeClick, onHandClick, onBenchClick, onActiveClick, onDeckClick, onTrashClick, isOpponent }) {
  if (isOpponent) {
    // Opponent side layout mirrored:
    return (
      <div className='flex justify-between items-center border-2 h-[50%] bg-red-400'>
        <div className="flex flex-col justify-center w-[15vw] h-[100%]">
          <div className="relative pl-[5vw] h-[25vh]">
            <TrashPile cards={data.trash} onClick={onTrashClick} />
          </div>
          <div className="relative h-[25vh] pl-[5vw] pb-[7vh]">
            <DeckPile cards={data.deck} onClick={onDeckClick} />
          </div>
        </div>
        <div className='flex flex-col justify-between items-center h-[100%] w-[70vw] gap-[1.5vh]'>
          <HandRow cards={data.hand} onClick={onHandClick} isOpponent={true} />
          <BenchRow cards={data.bench} onClick={onBenchClick} />
          <ActiveRow cards={data.active} onClick={onActiveClick} />
        </div>
        <div className='flex flex-col justify-center items-center w-[15vw] h-[100%]'>
          <PriceRow cards={data.prize} onClick={onPrizeClick} />
        </div>
      </div>
    )
  } else {
    return (
      <div className='flex justify-between items-center border-2 h-[50%] bg-white'>
        <div className='flex flex-col justify-center items-center w-[15vw] h-[100%]'>
          <PriceRow cards={data.prize} onClick={onPrizeClick} />
        </div>
        <div className='flex flex-col justify-between items-center h-[100%] w-[70vw] gap-[1.5vh]'>
          <ActiveRow cards={data.active} onClick={onActiveClick} />
          <BenchRow cards={data.bench} onClick={onBenchClick} />
          <HandRow cards={data.hand} onClick={onHandClick} />
        </div>
        <div className="flex flex-col justify-center w-[15vw] h-[100%]">
          <div className="relative pl-[5vw] h-[25vh]">
            <DeckPile cards={data.deck} onClick={onDeckClick} />
          </div>
          <div className="relative h-[25vh] pl-[5vw] pb-[7vh]">
            <TrashPile cards={data.trash} onClick={onTrashClick} />
          </div>
        </div>
      </div>
    )
  }
}

export default PlayerSide