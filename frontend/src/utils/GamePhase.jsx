const GamePhase = Object.freeze({
  SETUP: "setup",
  MULLIGAN_CHECK: "mulligan_check",
  COINFLIP: "coinflip",
  SELECT_PRIZE: "select_prize",
  SELECT_ACTIVE: "select_active",
  SELECT_BENCH: "select_bench",
  MAIN_PHASE: "main_phase",
  ATTACK_PHASE: "attack_phase",
  END_TURN: "end_turn",
  GAME_OVER: "game_over",
});

export default GamePhase
