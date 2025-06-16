import { useState } from 'react'

function DrawCardWheel({ max, onSelect, confirmed = false }) {
    const [selected, setSelected] = useState(max)

    function handleConfirm() {
        if (onSelect) onSelect(selected)
    }

    return (
        <div className="p-4 bg-blue-900 rounded-xl shadow-lg text-white text-center">
            <h2 className="text-lg font-bold mb-3">Select Bonus Cards to Draw</h2>
            <div className="flex items-center justify-center space-x-4">
                <button
                    disabled={selected === 0 || confirmed}
                    onClick={() => setSelected(prev => Math.max(0, prev - 1))}
                    className="bg-blue-700 px-3 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                    −
                </button>
                <div className="text-3xl font-bold">{selected}</div>
                <button
                    disabled={selected === max || confirmed}
                    onClick={() => setSelected(prev => Math.min(max, prev + 1))}
                    className="bg-blue-700 px-3 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                    ＋
                </button>
            </div>
            <button
                onClick={handleConfirm}
                disabled={confirmed}
                className="mt-4 bg-green-600 px-4 py-2 rounded hover:bg-green-500 disabled:opacity-50"
            >
                Confirm ({selected})
            </button>
        </div>
    )
}

export default DrawCardWheel
