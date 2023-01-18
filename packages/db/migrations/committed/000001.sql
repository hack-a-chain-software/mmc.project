--! Previous: -
--! Hash: sha1:9d7d3a2d3ad9a4b127247cb03f5b6537e21208e6

--! split: 0001-scenes.sql
drop table if exists scenes cascade;

create table scenes (
    id uuid primary key default gen_random_uuid(),
    description text not null,
    available_at timestamptz not null
);

comment on table scenes is 'The game''s screens. They are composed of a background image with clickable areas for interaction (clues and warps).';
comment on column scenes.available_at is 'A timestamp indicating when the scene will become available for users';

--! split: 0002-clues.sql
drop table if exists clues cascade;

create table clues (
    id uuid primary key default gen_random_uuid(),
    scene_id uuid not null references scenes (id),

    position_top numeric(4, 2) not null,
    position_left numeric(4, 2) not null,
    width integer not null,
    height integer not null,

    media text not null,
    placeholder text not null,
    nft_contract text not null,
    nft_id text not null
);

create index on clues (scene_id);

comment on table clues is 'Clues the user can find and mint when navigating scenes.';
comment on column clues.position_top is 'The CSS position_top value of the clue clickable area, as a percentage.';
comment on column clues.position_left is 'The CSS position_left value of the clue clickable area, as a percentage.';
comment on column clues.width is 'The CSS width of the clue clickable area, in px units.';
comment on column clues.height is 'The CSS height of the clue clickable area, in px units.';
comment on column clues.media is 'A reference to the static asset of the clue''s image.';
comment on column clues.nft_contract is 'The account ID of the contract the clue''s NFT belongs to.';
comment on column clues.nft_contract is 'The ID of the clue''s NFT.';

--! split: 0003-warps.sql
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

--! split: 0004-images.sql
drop table if exists images cascade;

create table images (
    id uuid primary key default gen_random_uuid(),
    scene_id uuid not null references scenes (id),

    media text not null,
    z_index integer not null
);

create index on images (scene_id);

comment on table images is 'Composition of images of a scene';
comment on column images.media is 'An image of a composition of images of a scene';
comment on column images.z_index is 'The CSS z-index value of the image';
