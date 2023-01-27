--! Previous: -
--! Hash: sha1:8c11a657c9612b47105cbc27b4ddfcf4fc9d9cae

--! split: 1-current.sql
drop table if exists seasons cascade;

create table seasons (
    id uuid primary key default gen_random_uuid(),

    guess_questions json not null,

    guess_available_at timestamptz not null,
    season_ends_at timestamptz not null,
    created_at timestamptz not null
);

create index on seasons (id);

comment on table seasons is 'Table with seasons.';
comment on column seasons.guess_questions is 'Is the guess questions of guessing modal.';
comment on column seasons.guess_available_at is 'when guess is available.';
comment on column seasons.season_ends_at is 'When season ends.';
comment on column seasons.created_at is 'When season created.';

--! split: 0002-scenes.sql
drop table if exists scenes cascade;

create table scenes (
    id uuid primary key default gen_random_uuid(),
    season_id uuid not null references seasons (id),

    description text not null,
    name text not null,
    available_at timestamptz not null
);

comment on table scenes is 'The game''s screens. They are composed of a background image with clickable areas for interaction (clues and warps).';
comment on column scenes.available_at is 'A timestamp indicating when the scene will become available for users.';

--! split: 0003-clues.sql
drop table if exists clues cascade;

create table clues (
    id uuid primary key default gen_random_uuid(),
    scene_id uuid not null references scenes (id),

    position_top numeric(4, 2) not null,
    position_left numeric(4, 2) not null,
    width integer not null,
    height integer not null,

    name text not null,
    description text not null,
    media text not null,
    placeholder text not null,
    media_small text not null,
    placeholder_small text not null,
    nft_id text not null
);

create index on clues (scene_id);

comment on table clues is 'Clues the user can find and mint when navigating scenes.';
comment on column clues.position_top is 'The CSS position_top value of the clue clickable area, as a percentage.';
comment on column clues.position_left is 'The CSS position_left value of the clue clickable area, as a percentage.';
comment on column clues.width is 'The CSS width of the clue clickable area, in px units.';
comment on column clues.height is 'The CSS height of the clue clickable area, in px units.';
comment on column clues.media is 'A reference to the static asset of the clue''s image.';
comment on column clues.placeholder is 'A reference to the static asset of the clue''s placeholder.';
comment on column clues.description is 'The description of the clue''s NFT.';
comment on column clues.media_small is 'A reference to the static asset of the clue''s image.';
comment on column clues.placeholder_small is 'A reference to the static asset of the clue''s placeholder.';
comment on column clues.name is 'The description of the clue''s NFT.';

--! split: 0004-warps.sql
drop table if exists warps cascade;

create table warps (
    id uuid primary key default gen_random_uuid(),
    scene_id uuid not null references scenes (id),

    position_top numeric(4, 2) not null,
    position_left numeric(4, 2) not null,
    width integer not null,
    height integer not null,

    warps_to uuid unique references scenes (id)
);

create index on warps (scene_id);

comment on table warps is 'Clickable regions of a scene that will navigate (warp) the user to another one.';
comment on column warps.position_top is 'The CSS position_top value of the warp clickable area, as a percentage.';
comment on column warps.position_left is 'The CSS position_left value of the warp clickable area, as a percentage.';
comment on column warps.width is 'The CSS width of the warp clickable area, in px units.';
comment on column warps.height is 'The CSS height of the warp clickable area, in px units.';
comment on column warps.warps_to is 'The ID of the scene the user will navigate to when clicking the warp.';

--! split: 0005-images.sql
drop table if exists images cascade;

create table images (
    id uuid primary key default gen_random_uuid(),
    scene_id uuid not null references scenes (id),

    media text not null,
    z_index integer not null
);

create index on images (scene_id);

comment on table images is 'Composition of images of a scene.';
comment on column images.media is 'An image of a composition of images of a scene.';
comment on column images.z_index is 'The CSS z-index value of the image.';

--! split: 0006-guess.sql
drop table if exists guess cascade;

create table guess (
    id uuid primary key default gen_random_uuid(),
    wallet_id text not null,

    who_murdered text not null,
    weapon text not null,
    motive text not null,
    random_number text not null,
    hash text not null,

    created_at timestamptz not null default now()
);

create index on guess (id);

comment on table guess is 'Table with users guess';
comment on column guess.wallet_id is 'Is the user wallet of the guess.';
comment on column guess.who_murdered is 'Is the guess who murdered.';
comment on column guess.weapon is 'Is the murder weapon.';
comment on column guess.motive is 'Is the motive for crime.';
comment on column guess.random_number is 'the random number of guess.';
comment on column guess.hash is 'the hash of guess.';
