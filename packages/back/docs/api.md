# Game API

The API accept requests to create new scenes, clues, warps and images.

## Create Scene
```bash
  await fetch(
    "/game/create-scene",
    {
      method: "POST",
      body: JSON.stringify({
        description: "description",
        name: "This is a fucking mock bro",
        available_at: "2016-03-26 15:10:10+00",
        seasonId: "838d9703-02ca-40d6-93ec-ec723052c0d1",
      })
    },
  );
```

## Create Clues
```bash
  await fetch(
    "/game/create-clues",
    {
      method: "POST",
      body: JSON.stringify({
        "sceneId": "dc9a9254-392a-4d77-84db-60fc52eb6360",
        "clues": [
            {
                width: 10,
                height: 10,
                name: "New Clue Exemplo",
                position_top: 64.00,
                position_left: 64.50,
                media: "./images/clues/ramen.png",
                placeholder: "./images/clues/ramen-silhouette.png",
                media_small: "./images/mini-clues/ramen.png",
                placeholder_small: "./images/mini-clues/ramen-silhouette.png",
                description: "The package of FSM Ramen noodles appears unopened and there is a sticky note attached to it that says “CHECK”.",
                nft_id: "19",
            },
        ],
      })
    },
  );
```

## Create Warps
```bash
  await fetch(
    "/game/create-warps",
    {
      method: "POST",
      body: JSON.stringify({
        sceneId: "dc9a9254-392a-4d77-84db-60fc52eb6360",
        warps: [
            {
                width: 10,
                height: 10,
                position_top: 42.00,
                position_left: 12.00,
                scene_id: "88bf421c-70fd-46b6-825f-024bd04952cb",
                warps_to: "473af5a1-6b3b-4d18-af28-2fc42e657ba2",
            },
        ],
      })
    },
  );
```

## Create Scene Image
```bash
  await fetch(
    "/game/create-scene-image",
    {
      method: "POST",
      body: JSON.stringify({
        sceneId: "dc9a9254-392a-4d77-84db-60fc52eb6360",
        image: {
            media: "./images/scenes/1.png",
            z_index: 1,
        },
      }),
    },
  );
```

## Update Scene Availability
```bash
  await fetch(
    "/game/create-scene-image",
    {
      method: "PUT",
      body: JSON.stringify({
        availability: "2019-03-26 15:10:10+00",
        sceneId: "dc9a9254-392a-4d77-84db-60fc52eb6360",
      }),
    },
  );
```
