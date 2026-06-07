import PlainImg from "../assets/plain_image.png";

export default function EmptyTab (){
    return(
        <div className="flex items-center justify-center min-h-[70vh] p-7">
            <div className="max-w-md w-full text-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl shadow-md px-8 py-12">
                <img src={PlainImg} alt="Fresh start" className="mx-auto w-40 sm:w-56 mb-6" />
                <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-gray-100">A fresh start awaits</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">This space is ready — start a new conversation or join an existing room.</p>
                {/* <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Start a conversation</button> */}
            </div>
        </div>
    )
}

