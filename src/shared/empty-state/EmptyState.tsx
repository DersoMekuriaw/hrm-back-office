import { IconFolderOff  } from '@tabler/icons-react';
import {  Paper, ThemeIcon, Text } from '@mantine/core';
import classes from './EmptyState.module.css';


export function EmptyState({
  title = "No Data Available",
  description = "You can get started again.",
}) {
  return (
    <div  className="bg-white">
        <Paper 
            withBorder 
            radius="md" 
            shadow="sm"
            className={classes.card} mt={20}
        >
            <ThemeIcon className={classes.icon} size={60} radius={60}>
                <IconFolderOff size={32} stroke={1.5} />
            </ThemeIcon>

            <Text ta="center" fw={1000} className={classes.title}> {title} </Text>
            <Text c="dimmed" ta="center" fz="sm"> {description} </Text>
        </Paper>
    </div>
  );
}