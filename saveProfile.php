<?php
$servername = "localhost";
$username = "root";
$password = ""; // Your database password
$dbname = "user_profiles";

// Connect to the database
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Save data from the POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'];
    $first_name = $_POST['firstName'];
    $father_name = $_POST['fatherName'];
    $grandfather_name = $_POST['grandFatherName'];
    $village = $_POST['village'];
    $current_place = $_POST['currentPlace'];
    $email = $_POST['email'];
    $profile_picture = $_POST['profilePicture'];

    $sql = "INSERT INTO users (username, first_name, father_name, grandfather_name, village, current_place, email, profile_picture)
            VALUES ('$username', '$first_name', '$father_name', '$grandfather_name', '$village', '$current_place', '$email', '$profile_picture')";

    if ($conn->query($sql) === TRUE) {
        echo "Profile saved successfully!";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

$conn->close();
?>
