import React from "react";
import { Link } from "react-router-dom";

function Home() {

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div>

      {/* HERO SECTION */}
      <div style={styles.hero}>
        <div style={styles.overlay}>

          <h1 style={styles.title}>
            Premium Vehicle Rental
          </h1>

          <p style={styles.subtitle}>
            Rent Cars, Bikes & SUVs at the Best Price
          </p>

          {/* Button only for users */}
          {(!user || !user.isAdmin) && (
            <Link to="/vehicles">
              <button style={styles.button}>
                Book Your Vehicle
              </button>
            </Link>
          )}

        </div>
      </div>

      {/* FEATURES */}
      <div style={styles.section}>

        <h2 style={styles.heading}>
          Why Choose Our Rental Service?
        </h2>

        <div style={styles.features}>

          <div style={styles.card}>
            <h3>Affordable Pricing</h3>
            <p>
              We offer the best rental prices with
              zero hidden charges.
            </p>
          </div>

          <div style={styles.card}>
            <h3>Wide Vehicle Range</h3>
            <p>
              Choose from Cars, Bikes, SUVs and
              Luxury vehicles.
            </p>
          </div>

          <div style={styles.card}>
            <h3>Secure Booking</h3>
            <p>
              100% secure online booking system
              with instant confirmation.
            </p>
          </div>

          <div style={styles.card}>
            <h3>24/7 Support</h3>
            <p>
              Our support team is available
              anytime to help you.
            </p>
          </div>

        </div>

      </div>

      {/* CALL TO ACTION */}
      {(!user || !user.isAdmin) && (
        <div style={styles.cta}>
          <h2>
            Ready to Ride?
          </h2>

          <p>
            Book your vehicle today and enjoy
            comfortable travel.
          </p>

          <Link to="/vehicles">
            <button style={styles.ctaButton}>
              Explore Vehicles
            </button>
          </Link>
        </div>
      )}

      {/* FOOTER */}
      <div style={styles.footer}>
        <p>
          © 2026 Vehicle Rental System | All Rights Reserved
        </p>
      </div>

    </div>
  );
}

const styles = {

  hero: {
    height: "90vh",
    backgroundImage:
      "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative"
  },

  overlay: {
    backgroundColor: "rgba(0,0,0,0.65)",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    color: "white",
    padding: "20px"
  },

  title: {
    fontSize: "60px",
    fontWeight: "bold"
  },

  subtitle: {
    fontSize: "22px",
    marginTop: "10px",
    marginBottom: "25px"
  },

  button: {
    padding: "14px 35px",
    fontSize: "18px",
    backgroundColor: "#ff4d30",
    border: "none",
    color: "white",
    cursor: "pointer",
    borderRadius: "6px",
    fontWeight: "bold"
  },

  section: {
    padding: "80px 20px",
    textAlign: "center",
    backgroundColor: "#f8f9fa"
  },

  heading: {
    fontSize: "36px",
    marginBottom: "40px",
    fontWeight: "bold"
  },

  features: {
    display: "flex",
    justifyContent: "center",
    gap: "30px",
    flexWrap: "wrap"
  },

  card: {
    width: "260px",
    padding: "25px",
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 6px 15px rgba(0,0,0,0.1)"
  },

  cta: {
    backgroundColor: "#111",
    color: "white",
    padding: "70px 20px",
    textAlign: "center"
  },

  ctaButton: {
    padding: "14px 35px",
    fontSize: "18px",
    marginTop: "20px",
    backgroundColor: "#ff4d30",
    border: "none",
    color: "white",
    cursor: "pointer",
    borderRadius: "6px"
  },

  footer: {
    backgroundColor: "#222",
    color: "white",
    textAlign: "center",
    padding: "18px"
  }

};

export default Home;