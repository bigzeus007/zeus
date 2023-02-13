import { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { db } from '@/firebase';
import { collection, getDocs } from "firebase/firestore";   

export default function Card({car}) {
  

  return (
    <div className="card">
      <div className="card__body">
        <img src={car.img} class="card__image" />
        <h2 className="card__title">{car.title}</h2>
        <p className="card__description">{props.description}</p>
      </div>
      <button className="card__btn">View Recipe</button>
    </div>
  );
}

