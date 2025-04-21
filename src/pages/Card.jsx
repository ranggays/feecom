
export default function Card({items}){
    return (
        <section className="max-w-7xl mx-auto px-4 py-16">
            <h2 className="text-3xl font-bold text -gray-800 mb-8">Produk Populer</h2>
            <div className="grid gap-8 md:grid-cols-3 sm:grid-cols-2">
            {items.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
                    <img src={item.image} alt={item.name} className="rounded-lg w-full h-48 object-cover mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-blue-600 font-bold mt-2">{item.price}</p>
                    <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                        Beli Sekarang
                    </button>
                </div>))}
            </div>
        </section>
    )
}
