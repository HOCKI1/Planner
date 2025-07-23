import {
  Button,
  Stack,
  Group,
  Text,
  ActionIcon,
  Switch,
  Select,
} from "@mantine/core";
import {
  IconRotateClockwise,
  IconTrash,
  Icon3dCubeSphere,
  IconGridDots,
} from "@tabler/icons-react";
import { useStore } from "../state";
import { FURNITURE_SIZES } from "../config/constants";

const FURNITURE_TYPES = [
  { id: "base_cabinet", name: "Base Cabinet" },
  { id: "wall_cabinet", name: "Wall Cabinet" },
  { id: "tall_cabinet", name: "Tall Cabinet" },
];

export default function Toolbar({ is3DMode, setIs3DMode }) {
  const {
    selectedObject,
    isSnapping,
    setSnapping,
    addObject,
    updateObjectSize,
    rotateObject,
    deleteObject,
  } = useStore();

  return (
    <>
      <Stack className="controls left-panel">
        <Text size="lg" fw={500}>
          Furniture
        </Text>
        {/* добавление объекта на сцену по id*/}
        {FURNITURE_TYPES.map((furniture) => (
          <Button key={furniture.id} onClick={() => addObject(furniture.id)}>
            Add {furniture.name}
          </Button>
        ))}
      </Stack>

      <Group mb="sm" justify="flex-end" gap="md">
        <Switch
          label="Grid Snapping"
          checked={isSnapping}
          onChange={(event) => setSnapping(event.currentTarget.checked)}
          thumbIcon={<IconGridDots size={12} stroke={2.5} />}
        />
        <Switch
          label="3D View"
          checked={is3DMode}
          onChange={(event) => setIs3DMode(event.currentTarget.checked)}
          thumbIcon={<Icon3dCubeSphere size={12} stroke={2.5} />}
        />
      </Group>

      <Stack className="controls right-panel">
        {selectedObject && !is3DMode ? (
          <>
            <Group>
              <Text size="lg" fw={500}>
                Selected{" "}
                {selectedObject.type
                  .split("_")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </Text>
              <ActionIcon
                variant="subtle"
                onClick={() => rotateObject(selectedObject)}
              >
                <IconRotateClockwise size={20} />
              </ActionIcon>
              <ActionIcon
                variant="subtle"
                color="red"
                onClick={() => deleteObject(selectedObject)}
              >
                <IconTrash size={20} />
              </ActionIcon>
            </Group>

            {/*  */}
            <Select
              label="Size"
              value={selectedObject.size}
              data={[
                { value: "small", label: "Small" },
                { value: "medium", label: "Medium" },
                { value: "large", label: "Large" },
              ]}
              onChange={(value) => updateObjectSize(selectedObject, value)}
            />
            <Text size="sm" c="dimmed">
              Dimensions: {selectedObject.width}x{selectedObject.depth}x
              {selectedObject.height} cm
            </Text>
          </>
        ) : (
          <Text size="lg" fw={500}>
            {is3DMode ? "3D Preview Mode" : "Select an object to edit"}
          </Text>
        )}
      </Stack>
    </>
  );
}
