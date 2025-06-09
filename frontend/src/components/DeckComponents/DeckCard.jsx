function DeckCard({ deck, onClick }) {
    return (
        <div 
            className="flex flex-col items-center w-[10vw] border-1 border-gray-200 shadow-md/30 rounded-[15px] p-[1vw] hover:cursor-pointer hover:shadow-lg/40"
            onClick={onClick}    
        >
            <img src="/cardbox.png" alt="cardbox_img" className=""/>
            <div>
                {deck.name}
            </div>
        </div>
    )
}

export default DeckCard