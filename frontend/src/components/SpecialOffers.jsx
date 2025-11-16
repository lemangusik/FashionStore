// SpecialOffers.jsx - ОБНОВЛЕННЫЙ ДЛЯ ОДЕЖДЫ
import React from "react";

const SpecialOffers = () => {
  const offers = [
    {
      id: 1,
      title: "Скидка 30% на летние платья",
      description: "Новая коллекция летних платьев",
      image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      badge: "Лето",
    },
    {
      id: 2,
      title: "Распродажа джинсов",
      description: "Все модели джинсов со скидкой 25%",
      image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      badge: "Sale",
    },
    {
      id: 3,
      title: "Бесплатная доставка",
      description: "При заказе от 5000 ₽",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      badge: "Подарок",
    },
  ];

  return (
    <section className="my-16">
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
        Специальные предложения
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={offer.image}
                alt={offer.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <span className="absolute top-3 right-3 bg-fashion-pink text-white px-3 py-1 rounded-full text-sm font-semibold">
                {offer.badge}
              </span>
            </div>
            <div className="p-6">
              <h3 className="font-bold text-gray-900 mb-2 text-lg">
                {offer.title}
              </h3>
              <p className="text-gray-600">{offer.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SpecialOffers;