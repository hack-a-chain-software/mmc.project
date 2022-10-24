create type clue_kind as enum ('clue', 'warp');

create table clues (
    id uuid primary key default gen_random_uuid(),
    scene_id uuid not null references scenes (id),

    position_top numeric(4, 2) not null,
    position_left numeric(4, 2) not null,
    media uuid references storage.objects (id) not null,
    
    kind clue_kind not null,
    owner text,
    warps_to uuid unique references scenes (id),

    constraint warp_has_no_owner check (kind != 'warp' or owner is null),
    constraint warp_does_warp check (kind != 'warp' or warps_to is not null),
    constraint clue_does_not_warp check (kind != 'clue' or warps_to is null)
);
