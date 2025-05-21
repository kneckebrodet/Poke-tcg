import { createPortal } from 'react-dom'
import { useEffect } from 'react'


function Modal( {pokemon, hideModal} ) {
    useEffect(() => {
        document.body.classList.add('overflow-hidden')

        return () => {
            document.body.classList.remove('overflow-hidden')
        }
    }, [])

    return createPortal(
        <div>
            <div className='fixed inset-0 bg-gray-300 opacity-80' onClick={hideModal}></div>
               <img
                    src={pokemon.image_url}
                    alt={pokemon.name}
                    className="fixed left-[37vw] top-[10vh] w-[26vw] mb-[1vh] rounded-[28px] hover:cursor-pointer border-1 border-gray-400 shadow-lg/30"
                />
        </div>, 
        document.querySelector('.modal-container')
    )
}

export default Modal