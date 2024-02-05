<?php
	require "../config.php";

  // Check if 'organizationAcronym' is set in the URL query string
  if (isset($_GET['organizationAcronym'])) {
    $organizationAcronym = $_GET['organizationAcronym'];
  } else {
    // Handle the case where 'organizationAcronym' is not provided
    die("Error: 'organizationAcronym' parameter is missing.");
  }

  // Sanitize the input to prevent SQL injection
  $organizationAcronym = mysqli_real_escape_string($conn, $organizationAcronym);

  // Retrieve Organization Details of the User
  $ReadOrg_Sql = "SELECT Organization_ID FROM organizations WHERE Organization_Acronym='$organizationAcronym'";
  $ReadOrg_Query = mysqli_query($conn, $ReadOrg_Sql);
  $organization = mysqli_fetch_assoc($ReadOrg_Query);
  $organizationId = $organization['Organization_ID'];

  // Read Proposal List
  $ProposalList_Sql = "SELECT * FROM proposals WHERE Organization_ID='$organizationId' AND Status='Proposed' ORDER BY Date_Proposed ASC";
  $ProposalList_Query = mysqli_query($conn, $ProposalList_Sql);

  // Fetch all proposals into an array
  $proposals = [];
  while ($row = mysqli_fetch_assoc($ProposalList_Query)) {
      $proposals[] = $row;
  }

  // Output the proposals as JSON
  header('Content-Type: application/json');
  echo json_encode($proposals);
?>
