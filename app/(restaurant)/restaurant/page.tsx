import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Flame, MapPin, Star, Wine } from "lucide-react";
import { QuickBooking } from "@/components/restaurant/quick-booking";
import { FeaturedDishes } from "@/components/restaurant/featured";
import { VenueDetails } from "@/components/restaurant/venue";
export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="red-dot" />
            CONTEMPORARY INDIAN · KOLKATA
          </span>
          <h1>
            A little fire.
            <br />A lot of <em>feeling.</em>
          </h1>
          <p>
            Familiar flavours, a fresh point of view.
            <br />
            Come for dinner. Stay for the evening.
          </p>
          <div className="hero-actions">
            <Link href="/restaurant/reserve" className="button button-primary">
              Reserve a table <ArrowUpRight size={19} />
            </Link>
            <Link href="/restaurant/menu" className="text-link">
              Discover our menu <ArrowUpRight size={17} />
            </Link>
          </div>
          <div className="hero-proof">
            <div className="hero-stars">
              <Star size={14} fill="currentColor" /> 4.8 <span>/ 5</span>
            </div>
            <span className="proof-divider" />
            <span>
              Good evenings, according to
              <br />
              <strong>240+ happy guests</strong>
            </span>
          </div>
          <a className="hero-scroll" href="#story">
            <ArrowDown size={15} /> Make yourself at home
          </a>
        </div>
        <div className="hero-image">
          <Image
            src="/images/dining.jpg"
            alt="The warm, plant-filled ARDO dining room with soft lighting and timber tables"
            fill
            preload
            sizes="(max-width: 800px) 100vw, 55vw"
          />
          <div className="hero-image-shade" />
          <span className="image-top-note">A TABLE. A CONVERSATION. AN EVENING.</span>
          <div className="image-bottom-note">
            <span className="small-serif">Your kind of place.</span>
            <span>
              <MapPin size={14} />
              Park Street, Kolkata
            </span>
          </div>
          <div className="hero-image-badge">
            <Flame size={19} />
            <span>
              GOOD FOOD.
              <br />
              NO SHORTCUTS.
            </span>
          </div>
        </div>
      </section>
      <div className="container quick-wrap">
        <QuickBooking />
      </div>
      <div className="brand-strip container">
        <span>ROOTED IN TRADITION</span>
        <span>MADE WITH THE SEASONS</span>
        <span>FINISHED OVER FIRE</span>
        <span>BEST SHARED</span>
      </div>
      <section className="container story-section section" id="story">
        <div className="story-images">
          <div className="story-main">
            <Image
              src="/images/interior.jpg"
              alt="An intimate table set for an evening at ARDO"
              fill
              sizes="(max-width: 700px) 90vw, 45vw"
            />
          </div>
          <div className="story-small">
            <Image
              src="/images/cocktail.jpg"
              alt="Thoughtfully mixed drinks at the bar"
              fill
              sizes="250px"
            />
            <span>A little something to start.</span>
          </div>
        </div>
        <div className="story-copy">
          <span className="eyebrow">AN OLD CITY. A NEW TABLE.</span>
          <h2>
            Rooted here.
            <br />
            <em>Open to everywhere.</em>
          </h2>
          <p>
            Kolkata has always known how to bring people together. We’re just giving it another
            table.
          </p>
          <p>
            At ARDO, Indian ingredients meet a little curiosity. The tandoor stays hot, the produce
            stays seasonal, and there’s always room for one more story.
          </p>
          <Link href="/restaurant/about" className="text-link">
            A little about us <ArrowUpRight size={18} />
          </Link>
          <div className="story-signature">
            Good food. Good company.<span>THE ARDO WAY</span>
          </div>
        </div>
      </section>
      <FeaturedDishes />
      <section className="experiences-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">MORE THAN A MEAL</span>
              <h2>Make an occasion of it.</h2>
            </div>
            <p>
              Some evenings deserve
              <br />a little extra thought.
            </p>
          </div>
          <div className="experience-grid">
            <Link href="/restaurant/reserve?occasion=Celebration" className="experience-card">
              <Image
                src="/images/chef.jpg"
                alt="A beautifully prepared dining experience"
                fill
                sizes="(max-width: 700px) 90vw, 50vw"
              />
              <div className="experience-overlay" />
              <div className="experience-content">
                <span className="eyebrow">THE CHEF’S TABLE</span>
                <h3>
                  A seat closer
                  <br />
                  to the story.
                </h3>
                <span>
                  Six courses. Seasonal favourites. A slower evening. <ArrowUpRight size={19} />
                </span>
              </div>
            </Link>
            <Link href="/restaurant/private-dining" className="experience-card">
              <Image
                src="/images/interior.jpg"
                alt="An elegant table for a private celebration"
                fill
                sizes="(max-width: 700px) 90vw, 50vw"
              />
              <div className="experience-overlay" />
              <div className="experience-content">
                <span className="eyebrow">PRIVATE DINING</span>
                <h3>
                  Your people.
                  <br />
                  Your evening.
                </h3>
                <span>
                  For the moments worth getting everyone together. <ArrowUpRight size={19} />
                </span>
              </div>
            </Link>
          </div>
          <div className="brunch-note">
            <Wine size={22} />
            <div>
              <strong>Sunday, without the hurry.</strong>
              <span>Our weekend brunch · 12 PM – 3:30 PM</span>
            </div>
            <Link href="/restaurant/reserve?time=12:30" className="text-link">
              Make it a date <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </section>
      <section className="container review-section section">
        <div className="review-score">
          <span className="eyebrow">WORD AROUND THE TABLE</span>
          <div>
            4.8<span>/ 5</span>
          </div>
          <span className="stars">★★★★★</span>
          <p>
            From 240+ guest reviews
            <br />
            <small>Fictional reviews for this demo</small>
          </p>
        </div>
        <blockquote>
          “The kind of place where you order one more thing, and then stay for one more hour.”
          <footer>
            <span className="review-avatar">AS</span>
            <div>
              <strong>Ananya Sen</strong>
              <span>A lovely anniversary evening</span>
            </div>
            <span className="review-stars">★★★★★</span>
          </footer>
        </blockquote>
        <blockquote>
          “Thoughtful food, warm service, and a butter chicken I’m still thinking about.”
          <footer>
            <span className="review-avatar">KM</span>
            <div>
              <strong>Kabir Mukherjee</strong>
              <span>Already planning our next visit</span>
            </div>
          </footer>
        </blockquote>
      </section>
      <section className="gallery-section">
        <div className="container section-heading">
          <div>
            <span className="eyebrow">A GLIMPSE OF ARDO</span>
            <h2>The mood, before the menu.</h2>
          </div>
          <span className="muted">A little warm. A little lively. All yours.</span>
        </div>
        <div className="gallery-grid">
          {["dining", "garden", "cocktail", "interior"].map((image, i) => (
            <div key={image}>
              <Image
                src={`/images/${image}.jpg`}
                alt={
                  [
                    "Warm dining room",
                    "Seasonal kitchen plate",
                    "Drinks from the bar",
                    "A table set for dinner",
                  ][i]
                }
                fill
                sizes="(max-width: 700px) 50vw, 25vw"
              />
            </div>
          ))}
        </div>
      </section>
      <section className="container section home-location">
        <VenueDetails />
      </section>
      <section className="final-cta">
        <div className="container">
          <span className="eyebrow">SAVE THE EVENING</span>
          <h2>
            Good company.
            <br />
            <em>We’ll take care of the rest.</em>
          </h2>
          <Link href="/restaurant/reserve" className="button button-light">
            Find your table <ArrowUpRight size={19} />
          </Link>
          <span className="cta-note">Instant confirmation. A warm welcome.</span>
        </div>
        <span className="cta-watermark" aria-hidden="true">
          a.
        </span>
      </section>
    </>
  );
}
