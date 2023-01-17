use std::time::SystemTime;

//Each clue has a  ranking ->
// % answerr is right
// Date of the guess vs. the end of the season
// 1000

fn calculate_ranks(guess_time: SystemTime) {
  // Query the database to get all rows from the guesses table
  let rows = query_database("SELECT * FROM guesses");

  // Create a vector to hold the ranking values
  let mut rankings = Vec::new();

  // Loop through the rows and calculate the timestamp difference for each one
  for row in rows {
    let guess_open_time = row.guess_open_time;
    let guess_time_diff = guess_time.duration_since(guess_open_time).unwrap();
    let guess_time_diff_nanos = guess_time_diff.as_nanos();

    // Add the timestamp difference to the rankings vector
    rankings.push(guess_time_diff_nanos);
  }

  // Sort the rankings vector in ascending order
  rankings.sort();

  // Loop through the rankings and print each one
  for (i, ranking) in rankings.iter().enumerate() {
    println!("Rank {}: {}", i + 1, ranking);
  }
}

use std::time::SystemTime;

fn calculate_reward(
  guess_ranking: u32,
  correct_guesses: u32,
  guess_reward_total_pool_amount: u32,
) -> u32 {
  // Query the database to find the percent of the reward pool based on the guess ranking
  let percent_of_reward_pool = query_database(
    "SELECT percent_of_reward_pool FROM rewards WHERE ranking = ?",
    guess_ranking,
  );

  // Calculate the reward amount by multiplying the percent of the reward pool by the number of correct guesses
  // and dividing by 3, and then multiplying by the total pool amount
  let reward_amount =
    percent_of_reward_pool * (correct_guesses / 3) * guess_reward_total_pool_amount;

  return reward_amount;
}
