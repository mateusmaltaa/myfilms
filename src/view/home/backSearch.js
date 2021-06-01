import React from 'react';
import './backSearch.css';

export default function BackSearch({item}){
    return(
        <section className="featured" style={{
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundImage:`url(https://image.tmdb.org/t/p/original${item.backdrop_path})`
            
        }}>
            <div className="featured--vertical">
            </div>
        </section>
    )
}