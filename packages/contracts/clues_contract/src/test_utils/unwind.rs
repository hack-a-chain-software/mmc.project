use core::panic;
use std::panic::UnwindSafe;

pub fn assert_unwind_error<F, R>(f: F, err: &'static str)
where
  F: FnOnce() -> R + UnwindSafe,
{
  let hook = std::panic::take_hook();
  std::panic::set_hook(Box::new(|_| {}));

  let panicked = std::panic::catch_unwind(f);
  assert!(
    panicked.is_err(),
    "Expected closure to panic with \"{}\" but it returned instead",
    err
  );
  std::panic::set_hook(hook);

  let panic_message = panicked.err().unwrap().downcast::<String>().unwrap();
  assert!(
    panic_message.contains(&err.to_string()),
    "Panic message \"{}\" didn't match expected error \"{}\" ",
    panic_message,
    err
  );
}
